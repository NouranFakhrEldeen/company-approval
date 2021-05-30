import {  ConflictException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Segment } from '../entities';
import { SegmentCreateDTO, SegmentQueryDTO, SegmentUpdateDTO, } from '../dto';
import { ErrorHandler } from '../helpers';
import { SegmentItemService } from '.';
import { SortTypeEnum } from '../enums';
import { ErrorMessagesKeys } from '../../infrastructure';

@Injectable()
export class SegmentService {
  private readonly errorHandler: ErrorHandler = ErrorHandler.getInstance();
  constructor(
    @InjectRepository(Segment) private readonly segmentRepository: Repository<Segment>,
    @Inject(forwardRef(() => SegmentItemService)) private readonly segmentItemService: SegmentItemService
  ) { }

  async create(segmentData: SegmentCreateDTO, requestMaker): Promise<any> {
    if(segmentData.items){
      segmentData.items = segmentData.items.map((item)=>({
        ...item, owner: requestMaker.owner, creator: requestMaker.sub,
      }))
    }
    const segment = this.segmentRepository.create([{ ...segmentData, owner: requestMaker.owner, creator: requestMaker.sub }]);
    try {
      await this.segmentRepository.save(segment);
    } catch (e) {
      segment[0].id && await this.delete(segment[0].id, requestMaker);
      if (this.errorHandler.isUniqueKeyViolation(e)) {
        if(e.message.match('dbo.segment_item'))
          throw new ConflictException(
            this.errorHandler.getErrorMessage(ErrorMessagesKeys.SEGMENT_ITEM_DUPLICATION),
          );
        throw new ConflictException(
          this.errorHandler.getErrorMessage(ErrorMessagesKeys.SEGMENT_DUPLICATION),
        );
      } else {
        throw e;
      }
    }
    return await this.getById(segment[0].id, requestMaker);
  }

  async createMany(segmentsData: Segment[]): Promise<any> {
    const segments = this.segmentRepository.create(segmentsData);
    try {
      await this.segmentRepository.save(segments);
      return segments;
    } catch (e) {
      this.segmentRepository.remove(segments);
      if (this.errorHandler.isUniqueKeyViolation(e)) {
        if(e.message.match('dbo.segment_item'))
          throw new ConflictException(
            this.errorHandler.getErrorMessage(ErrorMessagesKeys.SEGMENT_ITEM_DUPLICATION),
          );
        throw new ConflictException(
          this.errorHandler.getErrorMessage(ErrorMessagesKeys.SEGMENT_DUPLICATION),
        );
      } else {
        throw e;
      }
    }
  }

  async update(id: string, segmentData: SegmentUpdateDTO, requestMaker): Promise<Segment> {
    try {
      await this.segmentRepository.update({ id, owner: requestMaker.owner }, segmentData);
    } catch (e) {
      if (this.errorHandler.isUniqueKeyViolation(e)) {
        throw new ConflictException(
          this.errorHandler.getErrorMessage(ErrorMessagesKeys.SEGMENT_DUPLICATION),
        );
      } else {
        throw e;
      }
    }
    return await this.getById(id, requestMaker);
  }

  
  async updateMany(segmentsData: Segment[]): Promise<any> {
    try {
      const {records: segments} = await this.filter({checlistIds: segmentsData.map((seg)=> seg.checklistId)}, {}); 
      segments.forEach(segment => {
        const updateData = segmentsData.find((updated)=> updated.checklistId === segment.checklistId)
        segment.name = updateData.name,
        segment.type = updateData.type,
        segment.owner= updateData.owner,
        segment.creator= updateData.creator,
        segment.items= updateData.items.map((item) => ({
          segmentId: segment.id,
          owner: item.owner,
          creator: item.creator,
          number: item.number,
          name: item.name,
        }))
      });
      await this.segmentItemService.deleteManySegments(segments.map((seg)=> seg.id));
      await this.segmentRepository.save(segments);
    } catch (e) {
      if (this.errorHandler.isUniqueKeyViolation(e)) {
        throw new ConflictException(
          this.errorHandler.getErrorMessage(ErrorMessagesKeys.SEGMENT_DUPLICATION),
        );
      } else {
        throw e;
      }
    }
  }
  async delete(id: string, requestMaker): Promise<{ message: string, deletedCount: number }> {
    await this.segmentItemService.deleteMany(id, requestMaker);
    const response = await this.segmentRepository.delete({ id, owner: requestMaker.owner });
    return {
      message: response.affected ? 'Data deleted successfully' : 'no item to delete',
      deletedCount: response.affected,
    };
  }

  async softDelete(id: string, requestMaker): Promise<{ message: string}> {
    const parent = await this.getById(id, requestMaker); 
    parent && await this.segmentRepository.softRemove(parent);  
    return { message: parent ? 'Data deleted successfully' : 'no item to delete' };
  }

  async softDeleteMany(ids: string[]): Promise<any> {
    const segments = await this.segmentRepository.createQueryBuilder('seg')
    .where("seg.id IN (:...ids)", { ids: ids})
    .leftJoinAndSelect('seg.items', 'items', 'items.deletedAt IS NULL')
    .getMany();
    segments && await this.segmentRepository.softRemove(segments);  
    return { message: segments ? 'Data deleted successfully' : 'no item to delete' };
  }

  async restore(id: string, requestMaker): Promise<{ message: string}> {
    await this.segmentRepository.restore({ id, owner: requestMaker.owner });
    await this.segmentItemService.restoreMany(id, requestMaker);
    return { message: 'Data restored successfully' };
  }

  async getById(id: string, requestMaker): Promise<Segment> {
    const query = await this.segmentRepository.createQueryBuilder('segment');
    query.andWhere('segment.owner = :owner AND segment.id = :id', { owner: requestMaker.owner , id});
    query.leftJoinAndSelect('segment.items', 'items', 'items.deletedAt IS NULL')
    return query.getOne()
  }

  async getDeleted(): Promise<Segment[]> {
    const query = await this.segmentRepository.createQueryBuilder('segment');
    query.andWhere('segment.deletedAt NOT NULL')
    query.leftJoinAndSelect('segment.items', 'items', 'items.deletedAt IS NULL')
    return await query.getMany();
  }

  async filter(filters: SegmentQueryDTO, requestMaker): Promise<
    { pagination: any, records: Segment[] }> {
    const query = await this.segmentRepository.createQueryBuilder('segment');
    requestMaker.owner && query.andWhere('segment.owner = :owner', { owner: requestMaker.owner });
    this.queryMaker({ ...filters }, query);
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
    filters.sortType = SortTypeEnum.ASCENDING;
    filters.sortProperty = 'index';
    if (filters.name){
      query.andWhere('segment.name like :name', { name: `${filters.name}` });
    }
    if (filters.checlistIds?.length){
      query.where("segment.checklistId IN (:...ids)", { ids: filters.checlistIds})
    }
    if (filters.enabled) {
      query.andWhere('segment.enabled = :enabled', { enabled: filters.enabled });
    }
    if (filters.type) {
      query.andWhere('segment.type = :type', { type: filters.type });
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
}