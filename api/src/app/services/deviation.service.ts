import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {  Deviation, DeviationFeedbackHistory } from '../entities';
import { DeviationFixDTO, DeviationQueryDTO, DeviationReviewDTO } from '../dto';
import { ErrorHandler } from '../helpers';
import { ConfirmSetService } from '.';
import { ConfirmSetStatusEnum, DeviationStatusEnum, SortTypeEnum } from '../enums';
import { ErrorMessagesKeys, RolesConst } from '../../infrastructure';
import { InternalSyncService } from './internal-sync.service';

@Injectable()
export class DeviationService {
  private readonly errorHandler: ErrorHandler = ErrorHandler.getInstance();
  constructor(
    @InjectRepository(Deviation) private readonly deviationRepository: Repository<Deviation>,
    @InjectRepository(DeviationFeedbackHistory) private readonly deviationFeedbackRepository: Repository<DeviationFeedbackHistory>,
    @Inject(forwardRef(() => InternalSyncService)) private readonly internalSyncService: InternalSyncService,
    @Inject(forwardRef(() => ConfirmSetService)) private readonly confirmSetService: ConfirmSetService

  ) { }
  async delete(id: string, confirmSetId: string, requestMaker): Promise<{ message: string, deletedCount: number }> {
    await this.checkId(confirmSetId, requestMaker);
    const response = await this.deviationRepository.delete({ id, owner: requestMaker.owner, confirmSetId });
    return {
      message: response.affected ? 'Data deleted successfully' : 'no item to delete',
      deletedCount: response.affected,
    };
  }

  async softDelete(id: string, confirmSetId: string, requestMaker): Promise<{ message: string}> {
    await this.checkId(confirmSetId, requestMaker);
    const parent = await this.getById(id,confirmSetId, requestMaker); 
    parent && await this.deviationRepository.softRemove(parent);  
    return { message: parent ? 'Data deleted successfully' : 'no item to delete' };
  }

  async restore(id: string, confirmSetId: string, requestMaker): Promise<{ message: string}> {
    await this.checkId(confirmSetId, requestMaker);
    await this.deviationRepository.restore({ id, owner: requestMaker.owner });
    return { message: 'Data restored successfully' };
  }

  async getById(id: string, confirmSetId: string, requestMaker): Promise<Deviation> {
    await this.checkId(confirmSetId, requestMaker);
    const query = await this.deviationRepository.createQueryBuilder('deviation');
    query.andWhere('deviation.owner = :owner AND deviation.id = :id AND deviation.confirmSetId = :confirmSetId',
    { owner: requestMaker.owner , id, confirmSetId });
    query.leftJoinAndSelect('deviation.feedbackHistory', 'feedbackHistory', 'feedbackHistory.deletedAt IS NULL')
    query.leftJoinAndSelect('deviation.confirmSetSegment', 'confirmSetSegment', 'confirmSetSegment.deletedAt IS NULL')
    query.leftJoinAndSelect('confirmSetSegment.confirmSet', 'confirmSet', 'confirmSet.deletedAt IS NULL');
    query.leftJoinAndSelect('confirmSet.contacts', 'contacts', 'contacts.deletedAt IS NULL');
    if(requestMaker.role !== RolesConst.ADMIN){
      query.andWhere('contacts.email = :email', { email: requestMaker.sub });
    }
    return query.getOne();
  }
  async filter(filters: DeviationQueryDTO, confirmSetId: string, requestMaker): Promise<
  { pagination: any, records: Deviation[] }> {
    confirmSetId !== 'general' && await this.checkId(confirmSetId, requestMaker);
    const query = await this.deviationRepository.createQueryBuilder('deviation');
    query.andWhere('deviation.owner = :owner AND deviation.deletedAt IS NULL', { owner: requestMaker.owner });
    query.andWhere('deviation.confirmSetId = :confirmSetId', { confirmSetId });
    this.queryMaker({ ...filters }, query);
    query.leftJoinAndSelect('deviation.feedbackHistory', 'feedbackHistory', 'feedbackHistory.deletedAt IS NULL')
    query.leftJoinAndSelect('deviation.confirmSetSegment', 'confirmSetSegment', 'confirmSetSegment.deletedAt IS NULL')
    query.leftJoinAndSelect('confirmSetSegment.confirmSet', 'confirmSet', 'confirmSet.deletedAt IS NULL')
    query.leftJoinAndSelect('confirmSet.contacts', 'contacts', 'contacts.deletedAt IS NULL');
    if(requestMaker.role !== RolesConst.ADMIN){
      query.andWhere('contacts.email = :email', { email: requestMaker.sub });
    }
    const totalCount = await query.getCount();
    const skip = (parseInt(filters.page || '1', 10) - 1) * parseInt(filters.size || '20', 10);
    query.skip(skip);
    const limit = parseInt(filters.size || '20', 10);
    query.take(limit);
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
  async fix(
    {id, deviation, confirmSetId, requestMaker}:
    {id: string, deviation: DeviationFixDTO, confirmSetId: string, requestMaker}
  ): Promise<any> {
    const oldDeviation = await this.getById(id,confirmSetId, requestMaker);
    if(oldDeviation?.status !== DeviationStatusEnum.IN_FIXING && oldDeviation?.status !== DeviationStatusEnum.RETURN_IN_FIXING){
      throw new BadRequestException('this deviation not exist or not allowed to be fixed');
    }
    const retryNo = oldDeviation.retryNo || 0;
    if(oldDeviation.feedbackHistory?.length && oldDeviation.feedbackHistory.find(feedback => feedback.retryNo === retryNo)){
      const deviationFeedback = oldDeviation.feedbackHistory.find(feedback => feedback.retryNo === retryNo);
      await this.deviationFeedbackRepository.update({id: deviationFeedback.id}, {howItWasFixed: deviation.howItWasFixed, serviceProviderEmail: requestMaker.sub, serviceProviderCommentDate: new Date()})
    } else {
      const newDeviationFeedback = await this.deviationFeedbackRepository.create(
        {howItWasFixed: deviation.howItWasFixed, retryNo, deviationId: id, owner: requestMaker.owner, creator: requestMaker.sub, serviceProviderEmail: requestMaker.sub, serviceProviderCommentDate: new Date()}
      )
      await this.deviationFeedbackRepository.save(newDeviationFeedback);
    }
    delete deviation.howItWasFixed;
    await this.deviationRepository.update({ id, confirmSetId, owner: requestMaker.owner }, 
    {...deviation, status: DeviationStatusEnum.WAITING_APPROVE, retryNo});
    return await this.getById(id, confirmSetId, requestMaker);
  }

  async review(
    {id, deviation, confirmSetId, requestMaker}:
    {id: string, deviation: DeviationReviewDTO, confirmSetId: string, requestMaker}
  ): Promise<any> {
    const oldDeviation = await this.getById(id,confirmSetId, requestMaker);
    if(oldDeviation?.confirmSetSegment?.confirmSet.status !== ConfirmSetStatusEnum.IN_DEVIATION_PROCESSING){
      throw new BadRequestException('this deviation not exist or not allowed to be reviewed');
    }
    const retryNo = oldDeviation.retryNo || 0;
    if(oldDeviation.feedbackHistory?.length && oldDeviation.feedbackHistory.find(feedback => feedback.retryNo === retryNo)){
      const deviationFeedback = oldDeviation.feedbackHistory.find(feedback => feedback.retryNo === retryNo);
      await this.deviationFeedbackRepository.update({id: deviationFeedback.id}, {comment: deviation.comment, adminEmail: requestMaker.sub, adminCommentDate: new Date()})
    } else {
      const newDeviationFeedback = await this.deviationFeedbackRepository.create(
        {comment: deviation.comment, retryNo, deviationId: id, owner: requestMaker.owner, creator: requestMaker.sub, adminEmail: requestMaker.sub, adminCommentDate: new Date()}
      )
      await this.deviationFeedbackRepository.save(newDeviationFeedback);
    }
    delete deviation.comment;
    await this.deviationRepository.update({ id, confirmSetId, owner: requestMaker.owner }, 
      {...deviation, retryNo});
    // const deviationsInConfirmSet = (await this.filter({}, oldDeviation.confirmSetId ,requestMaker)).records;
    // if(!deviationsInConfirmSet.find((deviation)=>
    // deviation.status === DeviationStatusEnum.WAITING_APPROVE ||
    // deviation.status === DeviationStatusEnum.IN_FIXING ||
    // deviation.status === DeviationStatusEnum.RETURN_IN_FIXING
    // )){
    //   await this.internalSyncService.updateAudit({
    //     status: deviationsInConfirmSet.find((dev)=> dev.status === DeviationStatusEnum.REAUDIT) ? DeviationStatusEnum.REAUDIT : DeviationStatusEnum.APPROVED,
    //     auditRoundId: oldDeviation.confirmSetSegment?.confirmSet?.auditRoundId, 
    //   }, requestMaker);
    // }
    return await this.getById(id, confirmSetId, requestMaker);
  }

  private async queryMaker(filters, query) {
    query.andWhere("deviation.status != 'REAUDITED_THEN_REMOVED'");
    if (filters.status){
      query.andWhere('deviation.status = :status', { status: filters.status });
    }
    if (filters.number) {
      query.andWhere('deviation.number like :number', { number: `${filters.number}%` });
    }
    if (filters.description) {
      query.andWhere('deviation.description like :description', { description: filters.description });
    }
    if(filters.sortType && filters.sortProperty){
      query.orderBy(
        `deviation.${filters.sortProperty}`,
        filters.sortType === SortTypeEnum.ASCENDING ? 'ASC' : 'DESC'
      );
    }
    if (filters.from && filters.to){
      query.andWhere(`deviation.updatedAt BETWEEN :begin AND :end` ,{ begin: filters.from, end: filters.to});
    } else if(filters.from){
      query.andWhere('deviation.updatedAt > :updatedAt', { updatedAt: new Date(filters.from) });
    } else if(filters.to){
      query.andWhere('deviation.updatedAt < :updatedAt', { updatedAt: new Date(filters.to) });
    }
    return query;
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