import { BadRequestException, ConflictException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfirmSetContact } from '../entities';
import { ConfirmContactCreateDTO, ConfirmContactQueryDTO, ConfirmContactUpdateDTO } from '../dto';
import { ErrorHandler } from '../helpers';
import { SortTypeEnum } from '../enums';
import { ConfirmSetService } from '.';
import { ErrorMessagesKeys, RolesConst } from '../../infrastructure';

@Injectable()
export class ConfirmContactService {
  private readonly errorHandler: ErrorHandler = ErrorHandler.getInstance();
  constructor(
    @InjectRepository(ConfirmSetContact) private readonly confirmContactRepository: Repository<ConfirmSetContact>,
    @Inject(forwardRef(() => ConfirmSetService)) private readonly confirmSetService: ConfirmSetService
  ) { }

  async create(confirmContactData: ConfirmContactCreateDTO,confirmSetId: string, requestMaker): Promise<any> {
    await this.checkId(confirmSetId, requestMaker);
    const confirmContact = this.confirmContactRepository.create(
      [{ ...confirmContactData, owner: requestMaker.owner, creator: requestMaker.sub,confirmSetId }]
    );
    try {
      await this.confirmContactRepository.save(confirmContact);
    } catch (e) {
      if (this.errorHandler.isUniqueKeyViolation(e)) {
        throw new ConflictException(
          this.errorHandler.getErrorMessage(ErrorMessagesKeys.CONFIRM_CONTACT_DUPLICATION),
        );
      } else {
        throw e;
      }
    }
    return await this.getById(confirmContact[0].id,confirmSetId, requestMaker);
  }
  async update(id: string,confirmSetId: string, confirmContactData: ConfirmContactUpdateDTO, requestMaker): Promise<ConfirmSetContact> {
    await this.checkId(confirmSetId, requestMaker);
    try {
      await this.confirmContactRepository.update({ id, owner: requestMaker.owner,confirmSetId }, confirmContactData);
    } catch (e) {
      if (this.errorHandler.isUniqueKeyViolation(e)) {
        throw new ConflictException(
          this.errorHandler.getErrorMessage(ErrorMessagesKeys.CONFIRM_CONTACT_DUPLICATION),
        );
      } else {
        throw e;
      }
    }
    return await this.getById(id,confirmSetId, requestMaker);
  }
  async delete(id: string,confirmSetId: string, requestMaker): Promise<{ message: string, deletedCount: number }> {
    await this.checkId(confirmSetId, requestMaker);
    const response = await this.confirmContactRepository.delete({ id, owner: requestMaker.owner,confirmSetId });
    return {
      message: response.affected ? 'Data deleted successfully' : 'no item to delete',
      deletedCount: response.affected,
    };
  }
  async softDelete(id: string,confirmSetId: string, requestMaker): Promise<{ message: string}> {
    await this.checkId(confirmSetId, requestMaker);
    const parent = await this.getById(id,confirmSetId, requestMaker); 
    parent && await this.confirmContactRepository.softRemove(parent);  
    return { message: parent ? 'Data deleted successfully' : 'no item to delete' };
  }
  async getById(id: string,confirmSetId: string, requestMaker): Promise<ConfirmSetContact> {
    await this.checkId(confirmSetId, requestMaker);
    const query = await this.confirmContactRepository.createQueryBuilder('confirmContact');
    query.andWhere(
      'confirmContact.id = :id AND confirmContact.owner = :owner AND confirmContact.confirmSetId = :confirmSetId',
      { id, owner: requestMaker.owner,confirmSetId });
    if(requestMaker.role !== RolesConst.ADMIN){
      query.andWhere('confirmContact.email = :email', { email: requestMaker.sub });
    }
    query.leftJoinAndSelect('confirmContact.confirmSet', 'confirmSet', 'confirmSet.deletedAt IS NULL')
    query.leftJoinAndSelect('confirmSet.company', 'company', 'company.deletedAt IS NULL')
    return query.getOne();
  }
  async filter(filters: ConfirmContactQueryDTO,confirmSetId: string, requestMaker): Promise<
  { pagination: any, records: ConfirmSetContact[] }> {
    confirmSetId !== 'general' && await this.checkId(confirmSetId, requestMaker);
    const query = await this.confirmContactRepository.createQueryBuilder('confirmContact');
    query.andWhere('confirmContact.owner = :owner', { owner: requestMaker.owner });
    confirmSetId !== 'general' && query.andWhere('confirmSetId = :confirmSetId', { confirmSetId });
    query.leftJoinAndSelect('confirmContact.confirmSet', 'confirmSet', 'confirmSet.deletedAt IS NULL')
    query.leftJoinAndSelect('confirmSet.company', 'company', 'company.deletedAt IS NULL')
    if(requestMaker.role !== RolesConst.ADMIN){
      query.andWhere('confirmContact.email = :email', { email: requestMaker.sub });
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
    if (filters.companyId) {
      query.andWhere('confirmSet.companyId = :id', { id: filters.companyId });
    }
    if (filters.companyName) {
      query.andWhere('company.name like :name', { name: `${filters.companyName}%` });
    }
    if (filters.companyBusinessId) {
      query.andWhere('company.businessId = :businessId', { businessId: filters.companyBusinessId });
    }
    if (filters.name) {
      query.andWhere('confirmContact.name like :name', { name: `${filters.name}%` });
    }
    if (filters.type) {
      query.andWhere('confirmContact.type = :type', { type: filters.type });
    }
    if (filters.email) {
      query.andWhere('confirmContact.email like :email', { email: `${filters.email}%` });
    }
    if (filters.phone) {
      query.andWhere('confirmContact.phone like :phone', { search: `${filters.phone}%` });
    }
    if(filters.sortType && filters.sortProperty){
      query.orderBy(
        `confirmContact.${filters.sortProperty}`,
        filters.sortType === SortTypeEnum.ASCENDING ? 'ASC' : 'DESC'
      );
    }
    if (filters.from && filters.to){
      query.andWhere(`confirmContact.updatedAt BETWEEN :begin AND :end` ,{ begin: filters.from, end: filters.to});
    } else if(filters.from){
      query.andWhere('confirmContact.updatedAt > :updatedAt', { updatedAt: new Date(filters.from) });
    } else if(filters.to){
      query.andWhere('confirmContact.updatedAt < :updatedAt', { updatedAt: new Date(filters.to) });
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