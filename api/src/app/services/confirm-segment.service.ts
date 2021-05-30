import { BadRequestException, ConflictException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfirmSetSegment, Segment } from '../entities';
import { ConfirmSegmentCreateDTO, ConfirmSegmentQueryDTO, ConfirmSegmentUpdateDTO, } from '../dto';
import { ErrorHandler } from '../helpers';
import { ConfirmSegmentItemService, ConfirmSetService } from '.';
import { SortTypeEnum } from '../enums';
import { ErrorMessagesKeys, RolesConst } from '../../infrastructure';

@Injectable()
export class ConfirmSegmentService {
  private readonly errorHandler: ErrorHandler = ErrorHandler.getInstance();
  constructor(
    @InjectRepository(ConfirmSetSegment) private readonly segmentRepository: Repository<ConfirmSetSegment>,
    @InjectRepository(Segment) private readonly mainSegmentRepository: Repository<Segment>,
    @Inject(forwardRef(() => ConfirmSegmentItemService)) private readonly segmentItemService: ConfirmSegmentItemService,
    @Inject(forwardRef(() => ConfirmSetService)) private readonly confirmSetService: ConfirmSetService
  ) { }

  async create(segmentData: ConfirmSegmentCreateDTO, confirmSetId: string, requestMaker): Promise<any> {
    await this.checkId(confirmSetId, requestMaker);
    await this.checkRealSegment(segmentData.segmentId, requestMaker);
    if(segmentData.items){
      segmentData.items = segmentData.items.map((item)=>({
        ...item, owner: requestMaker.owner, creator: requestMaker.sub
      }))
    }
    const segment = this.segmentRepository.create([{ ...segmentData, owner: requestMaker.owner, creator: requestMaker.sub, confirmSetId }]);
    try {
      await this.segmentRepository.save(segment);
    } catch (e) {
      segment[0].id && await this.delete(segment[0].id,confirmSetId, requestMaker);
      if (this.errorHandler.isUniqueKeyViolation(e)) {
        if(e.message.match('dbo.confrim-set-segment_item'))
          throw new ConflictException(
            this.errorHandler.getErrorMessage(ErrorMessagesKeys.CONFIRM_SEGMENT_ITEM_DUPLICATION),
          );  
        throw new ConflictException(
          this.errorHandler.getErrorMessage(ErrorMessagesKeys.CONFIRM_SEGMENT_DUPLICATION),
        );
      } else {
        throw e;
      }
    }
    return await this.getById(segment[0].id,confirmSetId, requestMaker);
  }
  async duplicate(id: string,confirmSetId: string, requestMaker): Promise<any> {
    const duplicateFromSegment = await this.getById(id, confirmSetId, requestMaker);
    if(duplicateFromSegment.items){
      duplicateFromSegment.items = duplicateFromSegment.items.map((item)=>({
        ...item, owner: requestMaker.owner, creator: requestMaker.sub, createdAt: undefined, updatedAt: undefined, id: undefined
      }))
    }
    const segment = this.segmentRepository.create([{
      ...duplicateFromSegment, owner: requestMaker.owner, creator: requestMaker.sub,id: undefined, createdAt: undefined, updatedAt: undefined 
    }]);
    try {
      await this.segmentRepository.save(segment);
    } catch (e) {
      segment[0].id && await this.delete(segment[0].id,confirmSetId, requestMaker);
      if (this.errorHandler.isUniqueKeyViolation(e)) {
        if(e.message.match('dbo.confrim-set-segment_item'))
          throw new ConflictException(
            this.errorHandler.getErrorMessage(ErrorMessagesKeys.CONFIRM_SEGMENT_ITEM_DUPLICATION),
          );  
        throw new ConflictException(
          this.errorHandler.getErrorMessage(ErrorMessagesKeys.CONFIRM_SEGMENT_DUPLICATION),
        );
      } else {
        throw e;
      }
    }
    return await this.getById(segment[0].id,confirmSetId, requestMaker);
  }
  async update(id: string, confirmSetId: string, segmentData: ConfirmSegmentUpdateDTO, requestMaker): Promise<ConfirmSetSegment> {
    await this.checkId(confirmSetId, requestMaker);
    try {
      await this.segmentRepository.update({ id, owner: requestMaker.owner, confirmSetId }, segmentData);
    } catch (e) {
      if (this.errorHandler.isUniqueKeyViolation(e)) {
        throw new ConflictException(
          this.errorHandler.getErrorMessage(ErrorMessagesKeys.CONFIRM_SEGMENT_DUPLICATION),
        );
      } else {
        throw e;
      }
    }
    return await this.getById(id,confirmSetId, requestMaker);
  }
  async delete(id: string, confirmSetId: string, requestMaker): Promise<{ message: string, deletedCount: number }> {
    await this.checkId(confirmSetId, requestMaker);
    await this.segmentItemService.deleteMany(id, confirmSetId, requestMaker);
    const response = await this.segmentRepository.delete({ id, owner: requestMaker.owner, confirmSetId });
    return {
      message: response.affected ? 'Data deleted successfully' : 'no item to delete',
      deletedCount: response.affected,
    };
  }

  async softDelete(id: string, confirmSetId: string, requestMaker): Promise<{ message: string}> {
    await this.checkId(confirmSetId, requestMaker);
    const parent = await this.getById(id,confirmSetId, requestMaker); 
    parent && await this.segmentRepository.softRemove(parent);  
    return { message: parent ? 'Data deleted successfully' : 'no item to delete' };
  }

  async restore(id: string, confirmSetId: string, requestMaker): Promise<{ message: string}> {
    await this.checkId(confirmSetId, requestMaker);
    await this.segmentRepository.restore({ id, owner: requestMaker.owner });
    await this.segmentItemService.restoreMany(id,confirmSetId, requestMaker);
    return { message: 'Data restored successfully' };
  }

  async getById(id: string, confirmSetId: string, requestMaker): Promise<ConfirmSetSegment> {
    await this.checkId(confirmSetId, requestMaker);
    const query = await this.segmentRepository.createQueryBuilder('segment');
    query.andWhere('segment.owner = :owner AND segment.id = :id AND segment.confirmSetId = :confirmSetId',
    { owner: requestMaker.owner , id, confirmSetId });
    query.leftJoinAndSelect('segment.items', 'items', 'items.deletedAt IS NULL')
    query.leftJoinAndSelect('segment.confirmSet', 'confirmSet', 'confirmSet.deletedAt IS NULL')
    query.leftJoinAndSelect('confirmSet.contacts', 'contacts', 'contacts.deletedAt IS NULL')
    query.leftJoinAndSelect('confirmSet.company', 'company', 'company.deletedAt IS NULL')
    if(requestMaker.role !== RolesConst.ADMIN){
      query.andWhere('contacts.email = :email', { email: requestMaker.sub });
    }
    return query.getOne()
  }
  async filter(filters: ConfirmSegmentQueryDTO, confirmSetId: string, requestMaker): Promise<
  { pagination: any, records: ConfirmSetSegment[] }> {
    confirmSetId !== 'general' && await this.checkId(confirmSetId, requestMaker);
    const query = await this.segmentRepository.createQueryBuilder('segment');
    query.andWhere('segment.owner = :owner AND segment.deletedAt IS NULL', { owner: requestMaker.owner });
    confirmSetId !== 'general' && query.andWhere('segment.confirmSetId = :confirmSetId', { confirmSetId });
    this.queryMaker({ ...filters }, query);
    query.leftJoinAndSelect('segment.confirmSet', 'confirmSet', 'confirmSet.deletedAt IS NULL')
    query.leftJoinAndSelect('confirmSet.contacts', 'contacts', 'contacts.deletedAt IS NULL')
    query.leftJoinAndSelect('confirmSet.company', 'company', 'company.deletedAt IS NULL')
    if(requestMaker.role !== RolesConst.ADMIN){
      query.andWhere('contacts.email = :email', { email: requestMaker.sub });
    }
    const totalCount = await query.getCount();
    const skip = (parseInt(filters.page || '1', 10) - 1) * parseInt(filters.size || '20', 10);
    query.skip(skip)
    const limit = parseInt(filters.size || '20', 10)
    query.take(limit)
    query.leftJoinAndSelect('segment.items', 'items', 'items.deletedAt IS NULL')
    const records = await query.getMany();
    return {
      records,
      pagination: {
        count: records.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: parseInt(filters.page || '1', 10),
        total: totalCount,
      }
    }
  }

  private async queryMaker(filters, query) {
    if (filters.number){
      query.andWhere('segment.number = :number', { number: filters.number });
    }
    if (filters.name) {
      query.andWhere('segment.name like :name', { name: `${filters.name}%` });
    }
    if (filters.answer) {
      query.andWhere('segment.answer like :answer', { answer: filters.answer });
    }
    if (filters.description) {
      query.andWhere('segment.description like :description', { description: filters.description });
    }
    if(filters.sortType && filters.sortProperty){
      query.orderBy(
        `segment.${filters.sortProperty}`,
        filters.sortType === SortTypeEnum.ASCENDING ? 'ASC' : 'DESC'
      );
    }
    if (filters.from && filters.to){
      query.andWhere(`segment.updatedAt BETWEEN :begin AND :end` ,{ begin: filters.from, end: filters.to});
    } else if(filters.from){
      query.andWhere('segment.updatedAt > :updatedAt', { updatedAt: new Date(filters.from) });
    } else if(filters.to){
      query.andWhere('segment.updatedAt < :updatedAt', { updatedAt: new Date(filters.to) });
    }
    return query;
  }
  private async checkRealSegment(id: string, requestMaker): Promise<boolean>{
    if(!await this.mainSegmentRepository.findOne({id, owner: requestMaker.owner})){
      throw new BadRequestException(
        this.errorHandler.getErrorMessage(ErrorMessagesKeys.SEGMENT_ID_WRONG),
      );
    }
    return true;
  }
  private async checkManyRealSegment(ids: string[], requestMaker): Promise<boolean>{
    const segments = await this.mainSegmentRepository.createQueryBuilder('segment')
      .where("segment.id IN (:...ids) AND segment.owner = :owner ", { ids, owner: requestMaker.owner}).getMany()
    if(ids.length !== segments.length){
      throw new BadRequestException(
        this.errorHandler.getErrorMessage(ErrorMessagesKeys.SEGMENT_ID_WRONG),
      );
    }
    return true;
  }
  private async checkId(confirmSetId: string, requestMaker): Promise<boolean>{
    if(!await this.confirmSetService.getById(confirmSetId, requestMaker)){
      throw new BadRequestException(
        this.errorHandler.getErrorMessage(ErrorMessagesKeys.CONFIRM_SET_ID_WRONG),
      );
    }
    return true;
  }
}