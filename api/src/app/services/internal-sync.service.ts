import { forwardRef, HttpService, Inject, Injectable, InternalServerErrorException} from '@nestjs/common';

import { SegmentService } from '.';
import { ConfirmSet, ConfirmSetSegment, Deviation, Segment } from '../entities';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfirmSetStatusEnum, DeviationStatusEnum, SegmentStatusEnum } from '../enums';
import { CompanyService } from './company.service';
import { RolesConst } from '../../infrastructure';

@Injectable()
export class InternalSyncService {
  username;
  password;
  constructor(
    private readonly http: HttpService,
    @InjectRepository(ConfirmSet) private readonly confirmSetRepository: Repository<ConfirmSet>,
    @InjectRepository(ConfirmSetSegment) private readonly confirmSetSegmentRepository: Repository<ConfirmSetSegment>,
    @InjectRepository(Deviation) private readonly deviationRepository: Repository<Deviation>,
    @Inject(forwardRef(() => SegmentService)) private readonly segmentService: SegmentService,
    @Inject(forwardRef(() => CompanyService)) private readonly companyService: CompanyService,
  ) {
    this.username = process.env.INTERNAL_BASIC_AUTH_USER;
    this.password = process.env.INTERNAL_BASIC_AUTH_PASSWORD;
   }

  public async syncSegments(): Promise<{message:string, success:boolean, segments?: Segment[]}>{
    try 
    {
      const {records: currentSegments} = await this.segmentService.filter({page: '1',size: '999999999'},{})
      const {records: currentChecklists} = await this.getChecklists();
      const {created, updated, removed} = await this.getSegmentsChanges({currentSegments, currentChecklists});
      await this.applySegmentChanges({created, updated, removed});
      const {records: segments} = await this.segmentService.filter({page: '1',size: '999999999'},{})
      return {message: 'synced successfully', success: true, segments}
    } catch (e) {
      return {message: 'sync faild', success: false}
    }
  }
  public async returnAudit({round, deviations, user, status}): Promise<{message:string, success:boolean}>{
    const segments = (await this.segmentService.filter({page: '1', size: '99999999'}, user))?.records;
    const company = await this.getCompanyOrCreateIt(round, user);
    const confirmSet = await this.getConfirmSetOrCreateIt({round, company, deviations, requestMaker: user, segments});
    switch(status){
      case 'APPROVED':
        await this.handleConfirmSetSegmentsChanges({round, confirmSet,requestMaker: user, segments});
        await this.confirmSetSegmentRepository.createQueryBuilder().update()
          .set({ status: SegmentStatusEnum.APPROVED, approvedTime: new Date() })
          .where(`confirmSetId = :confirmSetId`, { confirmSetId: confirmSet.id})
          .execute();
        await this.confirmSetRepository.update({ id: confirmSet.id }, { 
          status: ConfirmSetStatusEnum.COMPLETED, approvedTime: new Date(),
        });
        break;
      case 'REJECTED':
        await this.handleConfirmSetSegmentsChanges({round, confirmSet, deviations,requestMaker: user, segments});
        await this.deviationRepository.update({confirmSetId: confirmSet.id}, {status: 'REAUDITED_THEN_REMOVED'});
        deviations = await this.mapInspectionsToDeviations({confirmSet, owner: user.owner}, deviations);
        deviations = this.deviationRepository.create(deviations);
        await this.deviationRepository.save(deviations);
        await this.confirmSetRepository.update({ id: confirmSet.id },{
          status: ConfirmSetStatusEnum.IN_DEVIATION_FIXING, inDeviationTime: new Date(),
        });
        break;
    }
    return {message:'moved successfully', success: true};
  }

  public async createAuditRound(confirmSet, requestMaker): Promise<any>{
    try {
      const auditRound = this.mapConfirmSetToAuditRound(confirmSet, requestMaker);
      const url = `${process.env.AUDIT_TOOL_URL}/round/create`;
      if(!url || !this.username || !this.password){
        throw new InternalServerErrorException('internal server not configured');
      }
      const result: any = await this.http.post(url, auditRound, {
        headers:{
          Authorization: `Basic ${Buffer.from(this.username + ':' + this.password).toString('base64')}`,
        }
      }).toPromise();
      return result?.data?.data;
    } catch (e) {
      console.log(e)
      throw new InternalServerErrorException('can not move to audit tool')
    }
  }

  public async updateAudit(deviation, requestMaker): Promise<any> {
    try {
      const url = `${process.env.AUDIT_TOOL_URL}/round/status`;
      if(!url || !this.username || !this.password){
        throw new InternalServerErrorException('internal server not configured');
      }
      const result: any = await this.http.post(url, 
        {status: deviation.status, id: deviation.auditRoundId, requestMaker}, {
        headers:{
          Authorization: `Basic ${Buffer.from(this.username + ':' + this.password).toString('base64')}`,
        }
      }).toPromise();
      return result?.data?.data;
    } catch (e) {
      throw new InternalServerErrorException('can not move to audit tool')
    }
  }

  private async getCompanyOrCreateIt(round: any, requestMaker){
    let company = (await this.companyService.filter({name: round.companyName, businessId:round.companyBussinessId}, {role: RolesConst.ADMIN, owner: requestMaker.owner}))?.records?.[0];
    if(!company){
      company = await this.companyService.create({name: round.companyName, businessId:round.companyBussinessId}, requestMaker);
    }
    return company;
  }
  private async getConfirmSetOrCreateIt({round, company, deviations, requestMaker, segments}){
    await this.confirmSetRepository.update({ auditRoundId: round._id, owner: requestMaker.owner }, {companyId: company.id});
    const query = await this.confirmSetRepository.createQueryBuilder('confirmSet');
    query.andWhere('confirmSet.owner = :owner AND auditRoundId = :auditRoundId', { owner: requestMaker.owner, auditRoundId: round._id});
    query.leftJoinAndSelect('confirmSet.segments', 'segments', 'segments.deletedAt IS NULL')
    query.leftJoinAndSelect('segments.items', 'items', 'items.deletedAt IS NULL')
    let confirmSet = await query.getOne();
    if(!confirmSet){
      confirmSet = this.confirmSetRepository.create(this.mapRoundToConfirmSet({round,company,requestMaker,deviations, segments}));
      confirmSet = await this.confirmSetRepository.save(confirmSet);
    }
    return confirmSet;
  }
  private async getChecklists(): Promise<{records:any[], pagination:any}>{
    const url = `${process.env.AUDIT_TOOL_URL}/get-checklists`;
    if(!url || !this.username || !this.password){
      throw new InternalServerErrorException('internal server not configured');
    }
    try{
      const result: any = await this.http.get(url, {
        headers:{
          Authorization: `Basic ${Buffer.from(this.username + ':' + this.password).toString('base64')}`,
        }
      }).toPromise();
      return result?.data;
    } catch(e){
      throw new InternalServerErrorException('failed to get checklists');
    }
  }

  private async getSegmentsChanges({currentSegments, currentChecklists})
  : Promise<{updated:Segment[], created:Segment[], removed:string[]}> {

    const created = currentChecklists.filter(checklist => !currentSegments.find(
      (seg=> checklist._id === seg.checklistId)
    )).map(this.checklistToSegment);
  
    const updated = currentChecklists.filter(checklist => currentSegments.find(
      (seg=> checklist._id === seg.checklistId && (new Date(checklist.last_modify || checklist.created_at).getTime()) > new Date(seg.updatedAt).getTime())
    )).map(this.checklistToSegment);

    const removed = currentSegments.filter(seg => !currentChecklists.find(
      (checklist=> checklist._id === seg.checklistId)
    )).map(seg => seg.id);
    return {updated, created, removed}
  }
  private async applySegmentChanges(
    {created, updated, removed}:
    {created: Segment[],updated: Segment[], removed: string[]}
  ){
    if(removed?.length){
      await this.segmentService.softDeleteMany(removed)
    }
    if(updated?.length){
      await this.segmentService.updateMany(updated)
    }
    if(created?.length){
      await this.segmentService.createMany(created)
    }
  }
  
  private checklistToSegment(checklist) {
    checklist.type = checklist.type === 'GENERAL' ? 'NORMAL' : checklist.type;
    // eslint-disable-next-line prefer-spread
    const items = [].concat.apply([],checklist.sublevels?.map((sub)=> sub.items || []) || [])
    .concat(checklist.items || []);
    return {
      checklistId: checklist._id,
      name: checklist.name,
      enabled: true,
      owner: checklist.ownerKey,
      creator: checklist.creator?.sub,
      index: checklist.index,
      type: checklist.type,
      items: items.map((item) => ({
        owner: checklist.ownerKey,
        creator: checklist.creator?.sub,
        number: item.number,
        name: item.text,
      }))
    }
  }

  private async handleConfirmSetSegmentsChanges(
    {round, confirmSet, deviations, segments, requestMaker } : {round: any, confirmSet: ConfirmSet, deviations?: any[], segments: Segment[], requestMaker}
  ) {
    const newSegments = round.checkLists.map((checklist)=> this.auditchecklistToConfirmSegment(
      {checklist, confirmSet, deviations, segments, requestMaker}
    ));
    const added = newSegments.filter((newSegment)=> 
      !confirmSet.segments.find((segment)=> segment.checklistId === newSegment.checklistId)
    )
    added?.length && await this.confirmSetSegmentRepository.save((this.confirmSetSegmentRepository.create(added)));  
    // const removed = confirmSet.segments.filter((segment)=> 
      // !newSegments.find((newSegment)=> newSegment.checklistId === segment.checklistId && segment.status === SegmentStatusEnum.APPROVED)
    // )
    // removed?.length && await this.confirmSetSegmentRepository.softRemove(removed);  
    const updated = confirmSet.segments.filter((segment)=> 
      newSegments.find((newSegment)=> newSegment.checklistId === segment.checklistId)
    )
    updated?.length && await this.confirmSetSegmentRepository.save(updated);  
  }

  private auditchecklistToConfirmSegment(
    {checklist, confirmSet, deviations, segments, requestMaker}:{checklist: any, confirmSet?: ConfirmSet, deviations?: any[],segments: Segment[], requestMaker}
  ) : ConfirmSetSegment{
    checklist.type = checklist.type === 'GENERAL' ? 'NORMAL' : checklist.type;
    const segmentId =  segments.find((seg)=> seg.checklistId === (checklist._id || checklist.id))?.id;
    // eslint-disable-next-line prefer-spread
    const items = [].concat.apply([],checklist.sublevels?.map((sub)=> sub.items || []) || [])
    .concat(checklist.items || []);
    const opt:any = {}
    const stillAudited = deviations?.find((deviation) =>
      items.find(item => item.number === deviation.number) &&
      items.find(item => item.text === deviation.checklist.item) &&
      checklist.name === deviation.checklist.name &&
      !!checklist.room === !!deviation.checklist.room
    );
    if(stillAudited){
      opt.auditedTime= new Date();
    } else {
      opt.approvedTime = new Date();
    }
    return {
      confirmSetId: confirmSet?.id,
      status: stillAudited ? SegmentStatusEnum.AUDIT : SegmentStatusEnum.APPROVED,
      checklistId: checklist._id || checklist.id,
      name: checklist.name,
      owner: requestMaker?.owner,
      creator: requestMaker?.sub,
      type: checklist.type,
      city: checklist.addressCity,
			postalCode: checklist.addressPostalCode,
			street : checklist.addressStreet,
      addressAlias: checklist.addressDescription,
      room: checklist.room,
      segmentId,
      items: items.map((item) => ({
        owner: requestMaker?.owner,
        creator: requestMaker?.sub,
        number: item.number,
        name: item.text,
      })),
      ...opt
    }
  }
  
  private mapConfirmSetToAuditRound(confirmSet: ConfirmSet, requestMaker) {
    const metadata = confirmSet.segments.find((seg: any)=> {
      return (seg.city && seg.postalCode && seg.street);
    })
    return {
      requestMaker,
      name: `${confirmSet.company.name} ${new Date(confirmSet.startTime).toLocaleDateString("fi-FI").replace(/[\.\/\-]/g,'.')}` ,
      companyName: confirmSet.company.name,  
      companyBussinessId: confirmSet.company.businessId,
      date: confirmSet.startTime,
      addressCity: metadata?.city,
      addressPostalCode: metadata?.postalCode,
      addressStreet: metadata?.street,
      checklists: confirmSet.segments.filter((seg)=> seg.status === SegmentStatusEnum.AUDIT).map((seg)=>({
        checklistId: seg.checklistId,
        metadata: {
          addressDescription: seg.addressAlias,
          room: seg.room,
          addressCity: seg.city,
          addressPostalCode: seg.postalCode,
          addressStreet: seg.street,
        }
      })),
    };
    
  }

  private mapRoundToConfirmSet({round,company,requestMaker,deviations,segments}) {
    return {
      owner: requestMaker.owner,
      creator: requestMaker.sub,
      companyId: company.id,
      status: ConfirmSetStatusEnum.IN_AUDIT,
      startTime: new Date(round.date),
      auditedTime: new Date(round.created_at),
      contacts: [],
      segments: round.checkLists.map((checklist)=> this.auditchecklistToConfirmSegment({checklist, deviations, segments, requestMaker})),
      auditRoundId: round._id,
    };
  }
  private mapInspectionsToDeviations(
    {confirmSet, owner}
    : { confirmSet : ConfirmSet,  owner: string}, 
    inspections
  ) {
    return inspections.map((inspection)=>({
      owner,
      confirmSetId: confirmSet.id,
      confirmSetSegmentId: confirmSet.segments.find((segment)=>
        segment.name === inspection.checklist.name &&
        !!segment.room === !!inspection.checklist.room &&
        segment.items.find((item)=> item.number === inspection.checklist.number && item.name === inspection.checklist.item)),
      number: inspection.checklist.number,
      item: inspection.checklist.item,
      description: inspection.description,
      howToFix: inspection.howToFixIt,
      status: DeviationStatusEnum.IN_FIXING,
    }));
  }
};
