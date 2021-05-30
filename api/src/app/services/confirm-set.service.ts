import { BadRequestException, ConflictException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {  ConfirmSet, ConfirmSetSegment, Deviation, Segment } from '../entities';
import { ConfirmSetCreateDTO, ConfirmSetUpdateDTO, ConfirmSetQueryDTO } from '../dto';
import { ErrorHandler } from '../helpers';
import { CompanyService, SmtpServers } from './';
import { ConfirmSetCreateStatusEnum, ConfirmSetStatusEnum, DeviationStatusEnum, SegmentStatusEnum, SegmentTypeEnum, SortTypeEnum } from '../enums';
import { ErrorMessagesKeys, RolesConst } from '../../infrastructure';
import { CertificateService } from './certificate.service';
import { InternalSyncService } from './internal-sync.service';
import * as fs from 'fs';
import * as path from 'path';
@Injectable()
export class ConfirmSetService {
  private readonly errorHandler: ErrorHandler = ErrorHandler.getInstance();
  constructor(
    @InjectRepository(Deviation) private readonly deviationRepository: Repository<Deviation>,
    @InjectRepository(ConfirmSet) private readonly confirmSetRepository: Repository<ConfirmSet>,
    @InjectRepository(ConfirmSetSegment) private readonly confirmSetSegmentRepository: Repository<ConfirmSetSegment>,
    @Inject(forwardRef(() => CompanyService)) private readonly companyService: CompanyService,
    @Inject(forwardRef(() => CertificateService)) private readonly certificateService: CertificateService,
    @Inject(forwardRef(() => InternalSyncService)) private readonly syncService: InternalSyncService,
    @Inject(forwardRef(() => SmtpServers)) private readonly smtpServers: SmtpServers,
    @InjectRepository(Segment) private readonly mainSegmentRepository: Repository<Segment>,
  ) { }

  async create(confirmSetData: ConfirmSetCreateDTO, requestMaker): Promise<any> {
    if(! await this.companyService.getById(confirmSetData.companyId, requestMaker)){
      throw new BadRequestException(
        this.errorHandler.getErrorMessage(ErrorMessagesKeys.COMPANY_ID_WRONG),
      );
    }
    if(confirmSetData.contacts?.length){
      confirmSetData.contacts = confirmSetData.contacts.map((item)=>({
        ...item, owner: requestMaker.owner, creator: requestMaker.sub,
      }));
    }
    confirmSetData.startTime = confirmSetData.startTime ? new Date(confirmSetData.startTime) : confirmSetData.startTime;
    confirmSetData.approvedTime = ConfirmSetCreateStatusEnum.COMPLETED && confirmSetData.approvedTime ? new Date(confirmSetData.approvedTime) : undefined;
    if(confirmSetData.segments?.length){
      await this.checkManyRealSegment(confirmSetData.segments.map((item)=>item.segmentId), requestMaker)
      confirmSetData.segments = confirmSetData.segments.map((segment)=>{
        segment.status = confirmSetData.status === ConfirmSetCreateStatusEnum.COMPLETED ? SegmentStatusEnum.APPROVED : SegmentStatusEnum.PENDING;
        segment.items = segment.items ?
          segment.items.map((item)=>({...item, owner: requestMaker.owner, creator: requestMaker.sub})) : segment.items;
        return {...segment, owner: requestMaker.owner, creator: requestMaker.sub,
          approvedTime: confirmSetData.status === ConfirmSetCreateStatusEnum.COMPLETED ? new Date() : null};
      })
    }
    const confirmSet = this.confirmSetRepository.create([{ 
      ...confirmSetData, owner: requestMaker.owner, creator: requestMaker.sub,
      status: confirmSetData.status || ConfirmSetStatusEnum.COMPANY_FILLING,
    }]);
    if(confirmSetData.contacts?.length &&
      process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.SMTP_NAME && process.env.SMTP_USER && process.env.SMTP_PASS && process.env.SMTP_FROM){
      const emailServers = await this.smtpServers.getAll();
      const template = fs.readFileSync(
        path.resolve(__dirname, `../../public/${process.env.CREATE_CONFIRMSET_EMAIL_NOTIFICATION_FILE}`),
        'utf8',
      );
      await emailServers[0].send(
        {
          recipients: confirmSetData.contacts.map(contact => ({email:contact.email, type: 'NORMAL'})),
          ...JSON.parse(template),
        }
      );
  
    }
    try {
      await this.confirmSetRepository.save(confirmSet);
    } catch (e) {
      confirmSet[0].id && await this.delete(confirmSet[0].id, requestMaker);  
      if (this.errorHandler.isUniqueKeyViolation(e)) {
        if(e.message.match('dbo.confirm_set_contact'))
          throw new ConflictException(
            this.errorHandler.getErrorMessage(ErrorMessagesKeys.CONFIRM_CONTACT_DUPLICATION),
          );
        if(e.message.match('dbo.confirm_set_segment'))
          throw new ConflictException(
            this.errorHandler.getErrorMessage(ErrorMessagesKeys.CONFIRM_SEGMENT_DUPLICATION),
          );
        if(e.message.match('dbo.confirm_set_segment_item'))
          throw new ConflictException(
            this.errorHandler.getErrorMessage(ErrorMessagesKeys.CONFIRM_SEGMENT_ITEM_DUPLICATION),
          );
        } else {
        throw e;
      }
    }
    return await this.getById(confirmSet[0].id, requestMaker);
  }

  async submitAnswer(id: string, requestMaker): Promise<any> {
    const confirmSet = await this.getById(id, requestMaker);
    if(confirmSet.status !== ConfirmSetStatusEnum.COMPANY_FILLING){
      throw new BadRequestException('confirm set must be in comapny filling status');
    }
    for(const segment of confirmSet.segments) {
      if(!(segment.hasCertificate && confirmSet.certificates?.length) && segment.items.find((item)=> (!item.answer))){
        throw new BadRequestException('There is one or more items still open.');
      }
      if(
        (segment.type === SegmentTypeEnum.ADDRESS && !(segment.city?.length && /^\d{5}$/.test(segment.postalCode) && segment.street?.length))
        ||
        (segment.type === SegmentTypeEnum.ROOM && !(segment.city?.length && /^\d{5}$/.test(segment.postalCode) && segment.street?.length && segment.room))
      ){
        throw new BadRequestException('Metadata is required form every room and address segment');
      }
    }
    await this.confirmSetRepository.update({ id, owner: requestMaker.owner }, {status: ConfirmSetStatusEnum.CONFIRMING});
    return await this.getById(id, requestMaker);
  }

  async submitReview(id: string,data, requestMaker): Promise<any> {
    const confirmSet = await this.getById(id, requestMaker);
    let round;
    if(confirmSet.status !== ConfirmSetStatusEnum.CONFIRMING){
      throw new BadRequestException('confirm set must be in confirming status');
    }
    if(data.status === ConfirmSetStatusEnum.COMPLETED){
      if(confirmSet.segments.find((seg)=> seg.status !== SegmentStatusEnum.APPROVED)){
        throw new BadRequestException('all segments must be approved');
      }
    }
    if(data.status === ConfirmSetStatusEnum.IN_AUDIT){
      if(confirmSet.segments.find((seg)=> seg.status === SegmentStatusEnum.PENDING || seg.status === SegmentStatusEnum.RETURNED)){
        throw new BadRequestException('all segments must be approved or audit');
      }
      if(!confirmSet.segments.find((seg)=> seg.status === SegmentStatusEnum.AUDIT)){
        throw new BadRequestException('at least one segment with audit status');
      }
      round = await this.syncService.createAuditRound(confirmSet, requestMaker)
    }
    const approvedSegments = confirmSet.segments.filter((segment)=> segment.status === SegmentStatusEnum.APPROVED).map((segment)=> segment.id);
    approvedSegments.length && await this.confirmSetSegmentRepository.createQueryBuilder().update()
    .set({ approvedTime: new Date() })
    .where(`id IN (:...ids)`, { ids: approvedSegments})
    .execute();
    const auditedSegments = confirmSet.segments.filter((segment)=> segment.status === SegmentStatusEnum.AUDIT).map((segment)=> segment.id);
    auditedSegments.length && await this.confirmSetSegmentRepository.createQueryBuilder().update()
    .set({ auditedTime: new Date() })
    .where(`id IN (:...ids)`, { ids: auditedSegments})
    .execute();
    await this.confirmSetSegmentRepository.update(
      {confirmSetId: id, owner: requestMaker.owner, status: SegmentStatusEnum.RETURNED},
      { status: SegmentStatusEnum.PENDING }
      )
    await this.confirmSetRepository.update({ id, owner: requestMaker.owner }, 
      {
        status: data.status, auditRoundId: round?._id,
        auditedTime: round?._id ? new Date() : undefined,
        approvedTime: data.status === ConfirmSetStatusEnum.COMPLETED ? new Date() : undefined,
      }
    );
    return await this.getById(id, requestMaker);
  }

  async update(id: string, confirmSetData: ConfirmSetUpdateDTO, requestMaker): Promise<ConfirmSet> {
    if(confirmSetData.certificates && !(await this.certificateService.checkmanyCertificates(confirmSetData.certificates, id, requestMaker))){
      throw new BadRequestException('one or more certificate not exist');
    }
    confirmSetData.startTime = confirmSetData.startTime ? new Date(confirmSetData.startTime) : confirmSetData.startTime;
    confirmSetData.startTime || delete confirmSetData.startTime;
    await this.confirmSetRepository.update({ id, owner: requestMaker.owner }, confirmSetData);
    return await this.getById(id, requestMaker);
  }
  async delete(id: string, requestMaker): Promise<{ message: string, deletedCount: number }> {
    const response = await this.confirmSetRepository.delete({ id, owner: requestMaker.owner });
    return {
      message: response.affected ? 'Data deleted successfully' : 'no item to delete',
      deletedCount: response.affected,
    };
  }
  async softDelete(id: string, requestMaker): Promise<{ message: string}> {
    const parent = await this.getById(id, requestMaker); 
    parent && await this.confirmSetRepository.softRemove(parent);  
    return { message: parent ? 'Data deleted successfully' : 'no item to delete' };
  }
  async getById(id: string, requestMaker): Promise<ConfirmSet> {
    const query = await this.confirmSetRepository.createQueryBuilder('confirmSet');
    query.andWhere('confirmSet.owner = :owner AND confirmSet.id = :id',
    { owner: requestMaker.owner , id });
    query.leftJoinAndSelect('confirmSet.company', 'company', 'company.deletedAt IS NULL')
    query.leftJoinAndSelect('confirmSet.segments', 'segments', 'segments.deletedAt IS NULL')
    query.leftJoinAndSelect('segments.items', 'items', 'items.deletedAt IS NULL')
    query.leftJoinAndSelect('segments.deviations', 'deviations', "deviations.deletedAt IS NULL AND deviations.status != 'REAUDITED_THEN_REMOVED'")
    query.leftJoinAndSelect('confirmSet.contacts', 'contacts', 'contacts.deletedAt IS NULL')
    if(requestMaker.role !== RolesConst.ADMIN){
      query.andWhere('contacts.email = :email', { email: requestMaker.sub });
    }
    return await query.getOne();
  }
  async getCertificatesById(id: string, requestMaker): Promise<any> {
    const confirmset = await this.getById(id, requestMaker);
    return await this.certificateService.getConfirmSetSertificats(confirmset, requestMaker);
  }
  async filter(filters: ConfirmSetQueryDTO, requestMaker): Promise<
    { pagination: any, records: ConfirmSet[] }> {
    const query = await this.confirmSetRepository.createQueryBuilder('confirmSet');
    query.andWhere('confirmSet.owner = :owner', { owner: requestMaker.owner });
    query.leftJoinAndSelect('confirmSet.company', 'company', 'company.deletedAt IS NULL')
    query.leftJoinAndSelect('confirmSet.segments', 'segments', 'segments.deletedAt IS NULL')
    query.leftJoinAndSelect('segments.deviations', 'deviations', "deviations.deletedAt IS NULL AND deviations.status != 'REAUDITED_THEN_REMOVED'")
    query.leftJoinAndSelect('segments.items', 'items', 'items.deletedAt IS NULL')
    query.leftJoinAndSelect('confirmSet.contacts', 'contacts', 'contacts.deletedAt IS NULL')
    if(requestMaker.role !== RolesConst.ADMIN){
      query.andWhere('contacts.email = :email', { email: requestMaker.sub });
    }
    this.queryMaker({ ...filters }, query);
    const totalCount = await query.getCount();
    const countQuery = this.confirmSetRepository.createQueryBuilder('confirmSet')
    .select('confirmSet.status as status , COUNT(DISTINCT confirmSet.id) AS count')
    .leftJoin('confirmSet.contacts', 'contacts', 'contacts.deletedAt IS NULL')
    .groupBy('confirmSet.status')
    if(requestMaker.role !== RolesConst.ADMIN){
      countQuery.where('contacts.email = :email', { email: requestMaker.sub });
    }
    const counts = await countQuery.getRawMany();
    const skip = (parseInt(filters.page || '1', 10) - 1) * parseInt(filters.size || '20', 10);
    query.skip(skip)
    const limit = parseInt(filters.size || '20', 10)
    query.take(limit)
    const records = await query.getMany();
    return {
      records,
      pagination: {
        statusCount: counts.reduce((accumulator, currentValue) => {
          accumulator[currentValue.status] = currentValue.count;
          return accumulator;
        }, {}),
        count: records.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: parseInt(filters.page || '1', 10),
        total: totalCount,
      }
    }
  }
  async changeAdminStatus(confirmSetId, requestMaker): Promise<ConfirmSet>{
    const confirmSet = await this.getById(confirmSetId, requestMaker);
    const deviationsInConfirmSet = await this.deviationRepository.find({confirmSetId});
    if(
      confirmSet.status === ConfirmSetStatusEnum.IN_DEVIATION_PROCESSING &&
      !deviationsInConfirmSet.find((deviation)=>
      (deviation.status === DeviationStatusEnum.WAITING_APPROVE ||
      deviation.status === DeviationStatusEnum.IN_FIXING ||
      deviation.status === DeviationStatusEnum.RETURN_IN_FIXING)
    )){
      const isAudited = deviationsInConfirmSet.find((dev)=> dev.status === DeviationStatusEnum.REAUDIT)
      await this.syncService.updateAudit({
        status: isAudited ? DeviationStatusEnum.REAUDIT : DeviationStatusEnum.APPROVED,
        auditRoundId: confirmSet?.auditRoundId, 
      }, requestMaker);
      !isAudited && await this.confirmSetSegmentRepository.update({ confirmSetId }, {status: SegmentStatusEnum.APPROVED, approvedTime: new Date()});
      await this.confirmSetRepository.update({ id: confirmSetId, owner: requestMaker.owner }, {status: isAudited ? ConfirmSetStatusEnum.IN_AUDIT : ConfirmSetStatusEnum.COMPLETED});
    } else if (
      confirmSet.status === ConfirmSetStatusEnum.IN_DEVIATION_PROCESSING &&
      deviationsInConfirmSet.find((deviation)=>
      deviation.status === DeviationStatusEnum.RETURN_IN_FIXING
    )) {
      await this.deviationRepository.createQueryBuilder()
      .update()
      .set({ retryNo: () => "retryNo + 1" })
      .where(`confirmSetId = :confirmSetId AND status = :status`, { confirmSetId: confirmSetId, status: DeviationStatusEnum.RETURN_IN_FIXING })
      .execute();
      await this.confirmSetRepository.update({ id: confirmSetId, owner: requestMaker.owner }, {status: ConfirmSetStatusEnum.IN_DEVIATION_FIXING });
    }
    return this.getById(confirmSetId, requestMaker);
  }

  async changeSupplierStatus(confirmSetId, requestMaker): Promise<ConfirmSet>{
    const confirmSet = await this.getById(confirmSetId, requestMaker);
    const deviationsInConfirmSet = await this.deviationRepository.find({confirmSetId});

    if (confirmSet.status === ConfirmSetStatusEnum.IN_DEVIATION_FIXING &&
      !deviationsInConfirmSet.find((deviation)=>((deviation.status === DeviationStatusEnum.IN_FIXING || deviation.status === DeviationStatusEnum.RETURN_IN_FIXING)))
    ){
      await this.confirmSetRepository.update({ id: confirmSetId, owner: requestMaker.owner }, {status: ConfirmSetStatusEnum.IN_DEVIATION_PROCESSING});
    }
    return this.getById(confirmSetId, requestMaker);
  }

  private async queryMaker(filters, query) {
    if (filters.companyId){
      query.andWhere('confirmSet.companyId = :companyId', { companyId: filters.companyId });
    }
    if (filters.status) {
      const statuses = filters.status.split(',');
      query.andWhere('confirmSet.status IN (:...statuses)', { statuses: statuses });
    }
    if (filters.certificateId) {
      query.andWhere('confirmSet.certificates like :certificateId', { certificateId: filters.certificateId });
    }
    if (filters.fromStartDate && filters.toStartDate){
      query.andWhere(`confirmSet.startTime BETWEEN :begin AND :end` ,{ begin: filters.fromStartDate, end: filters.toStartDate});
    } else if(filters.fromStartDate){
      query.andWhere('confirmSet.startTime > :startTime', { startTime: new Date(filters.fromStartDate) });
    } else if(filters.toStartDate){
      query.andWhere('confirmSet.startTime < :startTime', { startTime: new Date(filters.toStartDate) });
    }
    if(filters.sortType && filters.sortProperty){
      query.orderBy(
        `confirmSet.${filters.sortProperty}`,
        filters.sortType === SortTypeEnum.ASCENDING ? 'ASC' : 'DESC'
      );
    } else {
      query.orderBy(
        `confirmSet.createdAt`,
        'DESC'
      );
    }
    if (filters.from && filters.to){
      query.andWhere(`confirmSet.updatedAt BETWEEN :begin AND :end` ,{ begin: filters.from, end: filters.to});
    } else if(filters.from){
      query.andWhere('confirmSet.updatedAt > :updatedAt', { updatedAt: new Date(filters.from) });
    } else if(filters.to){
      query.andWhere('confirmSet.updatedAt < :updatedAt', { updatedAt: new Date(filters.to) });
    }
    if (filters.fromApprovedTime && filters.toApprovedTime){
      query.andWhere(`confirmSet.approvedTime BETWEEN :begin AND :end` ,{ begin: filters.fromApprovedTime, end: filters.toApprovedTime});
    } else if(filters.fromApprovedTime){
      query.andWhere('confirmSet.approvedTime > :approvedTime', { approvedTime: new Date(filters.fromApprovedTime) });
    } else if(filters.toApprovedTime){
      query.andWhere('confirmSet.approvedTime < :approvedTime', { approvedTime: new Date(filters.toApprovedTime) });
    }

    if (filters.fromDeclinedTime && filters.toDeclinedTime){
      query.andWhere(`confirmSet.declinedTime BETWEEN :begin AND :end` ,{ begin: filters.fromDeclinedTime, end: filters.toDeclinedTime});
    } else if(filters.fromDeclinedTime){
      query.andWhere('confirmSet.declinedTime > :declinedTime', { declinedTime: new Date(filters.fromDeclinedTime) });
    } else if(filters.toDeclinedTime){
      query.andWhere('confirmSet.declinedTime < :declinedTime', { declinedTime: new Date(filters.toDeclinedTime) });
    }

    if (filters.fromAuditedTime && filters.toAuditedTime){
      query.andWhere(`confirmSet.auditedTime BETWEEN :begin AND :end` ,{ begin: filters.fromAuditedTime, end: filters.toAuditedTime});
    } else if(filters.fromAuditedTime){
      query.andWhere('confirmSet.auditedTime > :auditedTime', { auditedTime: new Date(filters.fromAuditedTime) });
    } else if(filters.toAuditedTime){
      query.andWhere('confirmSet.auditedTime < :auditedTime', { auditedTime: new Date(filters.toAuditedTime) });
    }

    if (filters.fromInDeviationTime && filters.toInDeviationTime){
      query.andWhere(`confirmSet.inDeviationTime BETWEEN :begin AND :end` ,{ begin: filters.fromInDeviationTime, end: filters.toInDeviationTime});
    } else if(filters.fromInDeviationTime){
      query.andWhere('confirmSet.inDeviationTime > :inDeviationTime', { inDeviationTime: new Date(filters.fromInDeviationTime) });
    } else if(filters.toInDeviationTime){
      query.andWhere('confirmSet.inDeviationTime < :inDeviationTime', { inDeviationTime: new Date(filters.toInDeviationTime) });
    }
    return query;
  }
  async checkManyRealSegment(ids: string[], requestMaker): Promise<boolean>{
    ids = ids.filter(function(item, pos) {
      return ids.indexOf(item) == pos;
    })
    const segments = await this.mainSegmentRepository.createQueryBuilder('segment')
      .where("segment.id IN (:...ids) AND segment.owner = :owner ", { ids, owner: requestMaker.owner}).getMany()
    if(ids.length !== segments.length){
      throw new BadRequestException(
        this.errorHandler.getErrorMessage(ErrorMessagesKeys.SEGMENT_ID_WRONG),
      );
    }
    return true;
  }

}

const asyncSome = async (arr: any[], predicate: any) => {
  for (const e of arr) {
    if (await predicate(e)) { return true; }
  }
  return false;
};
