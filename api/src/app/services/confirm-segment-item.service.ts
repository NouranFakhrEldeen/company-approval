import { BadRequestException, ConflictException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfirmSetSegmentItem } from '../entities';
import { ConfirmSegmentItemCreateDTO, ConfirmSegmentItemUpdateDTO, ConfirmSegmentItemQueryDTO } from '../dto';
import { ErrorHandler } from '../helpers';
import { SortTypeEnum } from '../enums';
import { ConfirmSegmentService } from '.';
import { ErrorMessagesKeys, RolesConst } from '../../infrastructure';

@Injectable()
export class ConfirmSegmentItemService {
  private readonly errorHandler: ErrorHandler = ErrorHandler.getInstance();
  constructor(
    @InjectRepository(ConfirmSetSegmentItem) private readonly segmentItemRepository: Repository<ConfirmSetSegmentItem>,
    @Inject(forwardRef(() => ConfirmSegmentService)) private readonly confrimSegmentService: ConfirmSegmentService
  ) { }

  async create(segmentItemData: ConfirmSegmentItemCreateDTO,confirmSetId: string, confirmSetSegmentId: string, requestMaker): Promise<any> {
    if(!await this.confrimSegmentService.getById(confirmSetSegmentId,confirmSetId, requestMaker)){
      throw new BadRequestException(
        this.errorHandler.getErrorMessage(ErrorMessagesKeys.SEGMENT_ID_WRONG),
      );
    }
    const segmentItem = this.segmentItemRepository.create(
      [{ ...segmentItemData, owner: requestMaker.owner, creator: requestMaker.sub, confirmSetSegmentId }]
    );
    try {
      await this.segmentItemRepository.save(segmentItem);
    } catch (e) {
      if (this.errorHandler.isUniqueKeyViolation(e)) {
        throw new ConflictException(
          this.errorHandler.getErrorMessage(ErrorMessagesKeys.CONFIRM_SEGMENT_ITEM_DUPLICATION),
        );
      } else {
        throw e;
      }
    }
    return await this.getById(segmentItem[0].id,confirmSetId,confirmSetSegmentId, requestMaker);
  }

  async createMany(segmentItems: ConfirmSegmentItemCreateDTO[],confirmSetId: string, confirmSetSegmentId: string,  requestMaker): Promise<any> {
    if(!await this.confrimSegmentService.getById(confirmSetSegmentId,confirmSetId, requestMaker)){
      throw new BadRequestException(
        this.errorHandler.getErrorMessage(ErrorMessagesKeys.SEGMENT_ID_WRONG),
      );
    }
    segmentItems = this.segmentItemRepository.create(segmentItems.map((item)=>({
      ...item, owner: requestMaker.owner, creator: requestMaker.sub, confirmSetSegmentId,
    })));
    try {
      await this.segmentItemRepository.save(segmentItems);
    } catch (e) {
      if (this.errorHandler.isUniqueKeyViolation(e)) {
        throw new ConflictException(
          this.errorHandler.getErrorMessage(ErrorMessagesKeys.CONFIRM_SEGMENT_ITEM_DUPLICATION),
        );
      } else {
        throw e;
      }
    }
    return segmentItems[0]
  }

  async update(id: string,confirmSetId: string, confirmSetSegmentId: string, segmentItemData: ConfirmSegmentItemUpdateDTO, requestMaker): Promise<ConfirmSetSegmentItem> {
    if(!await this.confrimSegmentService.getById(confirmSetSegmentId,confirmSetId, requestMaker)){
      throw new BadRequestException(
        this.errorHandler.getErrorMessage(ErrorMessagesKeys.SEGMENT_ID_WRONG),
      );
    }
    try {
      await this.segmentItemRepository.update({ id, confirmSetSegmentId, owner: requestMaker.owner }, segmentItemData);
    } catch (e) {
      if (this.errorHandler.isUniqueKeyViolation(e)) {
        throw new ConflictException(
          this.errorHandler.getErrorMessage(ErrorMessagesKeys.CONFIRM_SEGMENT_ITEM_DUPLICATION),
        );
      } else {
        throw e;
      }
    }
    return await this.getById(id,confirmSetId,confirmSetSegmentId, requestMaker);
  }
  async delete(id: string,confirmSetId: string,confirmSetSegmentId: string, requestMaker): Promise<{ message: string, deletedCount: number }> {
    if(!await this.confrimSegmentService.getById(confirmSetSegmentId,confirmSetId, requestMaker)){
      throw new BadRequestException(
        this.errorHandler.getErrorMessage(ErrorMessagesKeys.SEGMENT_ID_WRONG),
      );
    }
    const response = await this.segmentItemRepository.delete({ id, confirmSetSegmentId, owner: requestMaker.owner });
    return {
      message: response.affected ? 'Data deleted successfully' : 'no item to delete',
      deletedCount: response.affected,
    };
  }
  async softDelete(id: string,confirmSetId: string, confirmSetSegmentId: string, requestMaker): Promise<{ message: string }> {
    if(!await this.confrimSegmentService.getById(confirmSetSegmentId,confirmSetId, requestMaker)){
      throw new BadRequestException(
        this.errorHandler.getErrorMessage(ErrorMessagesKeys.SEGMENT_ID_WRONG),
      );
    }
    const parent = await this.segmentItemRepository.findOne({ id, confirmSetSegmentId, owner: requestMaker.owner  })  
    parent && await this.segmentItemRepository.softRemove(parent);  
    return { message: parent ? 'Data deleted successfully' : 'no item to delete' };
  }
  async restore(id: string,confirmSetId: string, confirmSetSegmentId: string, requestMaker): Promise<{ message: string }> {
    if(!await this.confrimSegmentService.getById(confirmSetSegmentId,confirmSetId, requestMaker)){
      throw new BadRequestException(
        this.errorHandler.getErrorMessage(ErrorMessagesKeys.SEGMENT_ID_WRONG),
      );
    }
    await this.segmentItemRepository.restore({ id, confirmSetSegmentId, owner: requestMaker.owner });
    return { message: 'Data restored successfully' };
  }
  async deleteMany(confirmSetSegmentId: string,confirmSetId: string, requestMaker): Promise<{ message: string, deletedCount: number }> {
    if(!await this.confrimSegmentService.getById(confirmSetSegmentId,confirmSetId, requestMaker)){
      throw new BadRequestException(
        this.errorHandler.getErrorMessage(ErrorMessagesKeys.SEGMENT_ID_WRONG),
      );
    }
    const response = await this.segmentItemRepository.delete({ confirmSetSegmentId, owner: requestMaker.owner });
    return {
      message: response.affected ? 'Data deleted successfully' : 'no item to delete',
      deletedCount: response.affected,
    };
  }

  async softDeleteMany(confirmSetSegmentId: string,confirmSetId: string, requestMaker): Promise<{ message: string }> {
    if(!await this.confrimSegmentService.getById(confirmSetSegmentId,confirmSetId, requestMaker)){
      throw new BadRequestException(
        this.errorHandler.getErrorMessage(ErrorMessagesKeys.SEGMENT_ID_WRONG),
      );
    }
    await this.segmentItemRepository.softDelete({ confirmSetSegmentId, owner: requestMaker.owner });
    return { message: 'Data deleted successfully' };
  }

  async restoreMany(confirmSetSegmentId: string,confirmSetId: string, requestMaker): Promise<{ message: string }> {
    if(!await this.confrimSegmentService.getById(confirmSetSegmentId,confirmSetId, requestMaker)){
      throw new BadRequestException(
        this.errorHandler.getErrorMessage(ErrorMessagesKeys.SEGMENT_ID_WRONG),
      );
    }
    await this.segmentItemRepository.restore({ confirmSetSegmentId, owner: requestMaker.owner });
    return { message: 'Data restored successfully' };
  }

  async getById(id: string,confirmSetId: string, confirmSetSegmentId: string, requestMaker): Promise<ConfirmSetSegmentItem> {
    if(!await this.confrimSegmentService.getById(confirmSetSegmentId,confirmSetId, requestMaker)){
      throw new BadRequestException(
        this.errorHandler.getErrorMessage(ErrorMessagesKeys.SEGMENT_ID_WRONG),
      );
    }
    const query = await this.segmentItemRepository.createQueryBuilder('item');
    query.andWhere('item.owner = :owner AND item.id = :id',
    { owner: requestMaker.owner , id });
    query.leftJoinAndSelect('item.confirmSetSegment', 'segment', 'segment.deletedAt IS NULL')
    query.leftJoinAndSelect('segment.confirmSet', 'confirmSet', 'confirmSet.deletedAt IS NULL')
    query.leftJoinAndSelect('confirmSet.contacts', 'contacts', 'contacts.deletedAt IS NULL')
    query.leftJoinAndSelect('confirmSet.company', 'company', 'company.deletedAt IS NULL')
    if(requestMaker.role !== RolesConst.ADMIN){
      query.andWhere('contacts.email = :email', { email: requestMaker.sub });
    }
    return query.getOne()
    return await this.segmentItemRepository.findOne({ where: { id, confirmSetSegmentId, owner: requestMaker.owner } });
  }
  async filter(filters: ConfirmSegmentItemQueryDTO,confirmSetId: string, confirmSetSegmentId: string, requestMaker): Promise<{ pagination: any, records: ConfirmSetSegmentItem[] }> {
    if(
      confirmSetSegmentId !== 'general' &&
      confirmSetId !== 'general' &&
      !await this.confrimSegmentService.getById(confirmSetSegmentId,confirmSetId, requestMaker)
    ){
      throw new BadRequestException(
        this.errorHandler.getErrorMessage(ErrorMessagesKeys.SEGMENT_ID_WRONG),
      );
    }
    const query = await this.segmentItemRepository.createQueryBuilder('segmentItem');
    query.andWhere('segmentItem.owner = :owner AND segmentItem.deletedAt IS NULL', { owner: requestMaker.owner });
    confirmSetSegmentId !== 'general' &&
      query.andWhere('segmentItem.confirmSetSegmentId = :confirmSetSegmentId', { confirmSetSegmentId });
    query.leftJoinAndSelect('segmentItem.confirmSetSegment', 'segment', 'segment.deletedAt IS NULL')
    query.leftJoinAndSelect('segment.confirmSet', 'confirmSet', 'confirmSet.deletedAt IS NULL')
    query.leftJoinAndSelect('confirmSet.contacts', 'contacts', 'contacts.deletedAt IS NULL')
    query.leftJoinAndSelect('confirmSet.company', 'company', 'company.deletedAt IS NULL')
    if(requestMaker.role !== RolesConst.ADMIN){
      query.andWhere('contacts.email = :email', { email: requestMaker.sub });
    }
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
    if (filters.segmentId){
      query.andWhere('segmentItem.segmentId = :segmentId', { segmentId: filters.segmentId });
    }
    if (filters.name) {
      query.andWhere('segmentItem.name like :name', { number: `${filters.name}%` });
    }
    if (filters.status){
      query.andWhere('segmentItem.status = :status', { status: filters.status });
    }
    if (filters.type){
      query.andWhere('segmentItem.type = :type', { type: filters.type });
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