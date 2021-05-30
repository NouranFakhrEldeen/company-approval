import { BadRequestException, ConflictException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SegmentItem } from '../entities';
import { SegmentItemCreateDTO, SegmentItemQueryDTO, SegmentItemUpdateDTO, } from '../dto';
import { ErrorHandler } from '../helpers';
import { SortTypeEnum } from '../enums';
import { SegmentService } from '.';
import { ErrorMessagesKeys } from '../../infrastructure';

@Injectable()
export class SegmentItemService {
  private readonly errorHandler: ErrorHandler = ErrorHandler.getInstance();
  constructor(
    @InjectRepository(SegmentItem) private readonly segmentItemRepository: Repository<SegmentItem>,
    @Inject(forwardRef(() => SegmentService)) private readonly segmentService: SegmentService
  ) { }

  async create(segmentItemData: SegmentItemCreateDTO, segmentId: string, requestMaker): Promise<any> {
    if(!await this.segmentService.getById(segmentId, requestMaker)){
      throw new BadRequestException(
        this.errorHandler.getErrorMessage(ErrorMessagesKeys.SEGMENT_ID_WRONG),
      );
    }
    const segmentItem = this.segmentItemRepository.create(
      [{ ...segmentItemData, owner: requestMaker.owner, creator: requestMaker.sub, segmentId }]
    );
    try {
      await this.segmentItemRepository.save(segmentItem);
    } catch (e) {
      if (this.errorHandler.isUniqueKeyViolation(e)) {
        throw new ConflictException(
          this.errorHandler.getErrorMessage(ErrorMessagesKeys.SEGMENT_ITEM_DUPLICATION),
        );
      } else {
        throw e;
      }
    }
    return await this.getById(segmentItem[0].id,segmentId, requestMaker);
  }

  async createMany(segmentItems: SegmentItemCreateDTO[], segmentId: string,  requestMaker): Promise<any> {
    if(!await this.segmentService.getById(segmentId, requestMaker)){
      throw new BadRequestException(
        this.errorHandler.getErrorMessage(ErrorMessagesKeys.SEGMENT_ID_WRONG),
      );
    }
    segmentItems = this.segmentItemRepository.create(segmentItems.map((item)=>({
      ...item, owner: requestMaker.owner, creator: requestMaker.sub, segmentId,
    })));
    try {
      await this.segmentItemRepository.save(segmentItems);
    } catch (e) {
      if (this.errorHandler.isUniqueKeyViolation(e)) {
        throw new ConflictException(
          this.errorHandler.getErrorMessage(ErrorMessagesKeys.SEGMENT_ITEM_DUPLICATION),
        );
      } else {
        throw e;
      }
    }
    return segmentItems
  }

  async update(id: string, segmentId: string, segmentItemData: SegmentItemUpdateDTO, requestMaker): Promise<SegmentItem> {
    if(!await this.segmentService.getById(segmentId, requestMaker)){
      throw new BadRequestException(
        this.errorHandler.getErrorMessage(ErrorMessagesKeys.SEGMENT_ID_WRONG),
      );
    }
    try {
      await this.segmentItemRepository.update({ id, segmentId, owner: requestMaker.owner }, segmentItemData);
    } catch (e) {
      if (this.errorHandler.isUniqueKeyViolation(e)) {
        throw new ConflictException(
          this.errorHandler.getErrorMessage(ErrorMessagesKeys.SEGMENT_ITEM_DUPLICATION),
        );
      } else {
        throw e;
      }
    }
    return await this.getById(id,segmentId, requestMaker);
  }
  async delete(id: string,segmentId: string, requestMaker): Promise<{ message: string, deletedCount: number }> {
    if(!await this.segmentService.getById(segmentId, requestMaker)){
      throw new BadRequestException(
        this.errorHandler.getErrorMessage(ErrorMessagesKeys.SEGMENT_ID_WRONG),
      );
    }
    const response = await this.segmentItemRepository.delete({ id, segmentId, owner: requestMaker.owner });
    return {
      message: response.affected ? 'Data deleted successfully' : 'no item to delete',
      deletedCount: response.affected,
    };
  }
  async softDelete(id: string, segmentId: string, requestMaker): Promise<{ message: string }> {
    if(!await this.segmentService.getById(segmentId, requestMaker)){
      throw new BadRequestException(
        this.errorHandler.getErrorMessage(ErrorMessagesKeys.SEGMENT_ID_WRONG),
      );
    }
    const parent = await this.segmentItemRepository.findOne({ id, segmentId, owner: requestMaker.owner  })  
    parent && await this.segmentItemRepository.softRemove(parent);  
    return { message: parent ? 'Data deleted successfully' : 'no item to delete' };
  }
  async restore(id: string, segmentId: string, requestMaker): Promise<{ message: string }> {
    if(!await this.segmentService.getById(segmentId, requestMaker)){
      throw new BadRequestException(
        this.errorHandler.getErrorMessage(ErrorMessagesKeys.SEGMENT_ID_WRONG),
      );
    }
    await this.segmentItemRepository.restore({ id, segmentId, owner: requestMaker.owner });
    return { message: 'Data restored successfully' };
  }
  async deleteMany(segmentId: string, requestMaker): Promise<{ message: string, deletedCount: number }> {
    if(!await this.segmentService.getById(segmentId, requestMaker)){
      throw new BadRequestException(
        this.errorHandler.getErrorMessage(ErrorMessagesKeys.SEGMENT_ID_WRONG),
      );
    }
    const response = await this.segmentItemRepository.delete({ segmentId, owner: requestMaker.owner });
    return {
      message: response.affected ? 'Data deleted successfully' : 'no item to delete',
      deletedCount: response.affected,
    };
  }
  async deleteManySegments(segmentIds: string[]): Promise<{ message: string}> {
    const items = await this.segmentItemRepository.createQueryBuilder('item')
      .where("item.segmentId IN (:...ids)", { ids: segmentIds}).getMany()
    await this.segmentItemRepository.remove(items);
    return { message: 'Data deleted successfully' };
  }

  async softDeleteMany(segmentId: string, requestMaker): Promise<{ message: string }> {
    if(!await this.segmentService.getById(segmentId, requestMaker)){
      throw new BadRequestException(
        this.errorHandler.getErrorMessage(ErrorMessagesKeys.SEGMENT_ID_WRONG),
      );
    }
    await this.segmentItemRepository.softDelete({ segmentId, owner: requestMaker.owner });
    return { message: 'Data deleted successfully' };
  }

  async restoreMany(segmentId: string, requestMaker): Promise<{ message: string }> {
    if(!await this.segmentService.getById(segmentId, requestMaker)){
      throw new BadRequestException(
        this.errorHandler.getErrorMessage(ErrorMessagesKeys.SEGMENT_ID_WRONG),
      );
    }
    await this.segmentItemRepository.restore({ segmentId, owner: requestMaker.owner });
    return { message: 'Data restored successfully' };
  }

  async getById(id: string, segmentId: string, requestMaker): Promise<SegmentItem> {
    if(!await this.segmentService.getById(segmentId, requestMaker)){
      throw new BadRequestException(
        this.errorHandler.getErrorMessage(ErrorMessagesKeys.SEGMENT_ID_WRONG),
      );
    }
    return await this.segmentItemRepository.findOne({ where: { id, segmentId, owner: requestMaker.owner } });
  }
  async filter(filters: SegmentItemQueryDTO, segmentId: string, requestMaker): Promise<{ pagination: any, records: SegmentItem[] }> {
    if(segmentId !== 'general' && !await this.segmentService.getById(segmentId, requestMaker)){
      throw new BadRequestException(
        this.errorHandler.getErrorMessage(ErrorMessagesKeys.SEGMENT_ID_WRONG),
      );
    }
    const query = await this.segmentItemRepository.createQueryBuilder('segmentItem');
    query.andWhere('segmentItem.owner = :owner AND segmentItem.deletedAt IS NULL', { owner: requestMaker.owner });
    segmentId !== 'general' && query.andWhere('segmentItem.segmentId = :segmentId', { segmentId });
    this.queryMaker({ ...filters }, query);
    const totalCount = await query.getCount();
    const skip = (parseInt(filters.page || '1', 10) - 1) * parseInt(filters.size || '20', 10);
    query.skip(skip)
    const limit = parseInt(filters.size || '20', 10)
    query.take(limit)
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
    if (filters.name){
      query.andWhere('segmentItem.name like :name', { name: `${filters.name}%` });
    }
    if (filters.number) {
      query.andWhere('segmentItem.number = :number', { number: filters.number });
    }
    if(filters.sortType && filters.sortProperty){
      query.orderBy(
        `segmentItem.${filters.sortProperty}`,
        filters.sortType === SortTypeEnum.ASCENDING ? 'ASC' : 'DESC'
      );
    }
    if (filters.from && filters.to){
      query.andWhere(`segmentItem.updatedAt BETWEEN :begin AND :end` ,{ begin: filters.from, end: filters.to});
    } else if(filters.from){
      query.andWhere('segmentItem.updatedAt > :updatedAt', { updatedAt: new Date(filters.from) });
    } else if(filters.to){
      query.andWhere('segmentItem.updatedAt < :updatedAt', { updatedAt: new Date(filters.to) });
    }
    return query;
  }
}