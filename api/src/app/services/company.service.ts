import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company, SecurityContract } from '../entities';
import { CompanyCreateDTO, CompanyQueryDTO, CompanyUpdateDTO } from '../dto';
import { ErrorHandler } from '../helpers';
import { SortTypeEnum } from '../enums';
import { ErrorMessagesKeys, RolesConst } from '../../infrastructure';

@Injectable()
export class CompanyService {
  private readonly errorHandler: ErrorHandler = ErrorHandler.getInstance();
  constructor(
    @InjectRepository(Company) private readonly companyRepository: Repository<Company>,
  ) { }

  async create(companyData: CompanyCreateDTO, requestMaker): Promise<any> {
    const company = this.companyRepository.create([{ ...companyData, owner: requestMaker.owner, creator: requestMaker.sub }]);
    try {
      return (await this.companyRepository.save(company))[0];
    } catch (e) {
      if (this.errorHandler.isUniqueKeyViolation(e)) {
        throw new ConflictException(
          this.errorHandler.getErrorMessage(ErrorMessagesKeys.COMPANY_DUPLICATION),
        );
      } else {
        throw e;
      }
    }
  }
  async update(id: string, companyData: CompanyUpdateDTO, requestMaker): Promise<Company> {
    try {
      await this.companyRepository.update({ id, owner: requestMaker.owner }, companyData);
    } catch (e) {
      if (this.errorHandler.isUniqueKeyViolation(e)) {
        throw new ConflictException(
          this.errorHandler.getErrorMessage(ErrorMessagesKeys.COMPANY_DUPLICATION),
        );
      } else {
        throw e;
      }
    }
    return await this.getById(id, requestMaker);
  }
  async delete(id: string, requestMaker): Promise<{ message: string, deletedCount: number }> {
    const response = await this.companyRepository.delete({ id, owner: requestMaker.owner });
    return {
      message: response.affected ? 'Data deleted successfully' : 'no item to delete',
      deletedCount: response.affected,
    };
  }
  async softDelete(id: string, requestMaker): Promise<{ message: string}> {
    const parent = await this.getById(id, requestMaker); 
    parent && await this.companyRepository.softRemove(parent);  
    return { message: parent ? 'Data deleted successfully' : 'no item to delete' };
  }
  async getById(id: string, requestMaker): Promise<Company> {
    const query = await this.companyRepository.createQueryBuilder('company');
    query.andWhere('company.owner = :owner AND company.id = :id',
    { owner: requestMaker.owner , id });
    query.leftJoinAndSelect('company.confirmSets', 'confirmSets', 'confirmSets.deletedAt IS NULL')
    query.leftJoinAndSelect('confirmSets.segments', 'segments', 'segments.deletedAt IS NULL')
    query.leftJoinAndSelect('segments.deviations', 'deviations', "deviations.deletedAt IS NULL AND deviations.status != 'REAUDITED_THEN_REMOVED'")
    query.leftJoinAndSelect('segments.items', 'items', 'items.deletedAt IS NULL')
    query.leftJoinAndSelect('company.securityContracts', 'securityContracts', 
    'securityContracts.deletedAt IS NULL AND securityContracts.owner = company.owner')
    query.leftJoinAndSelect('confirmSets.contacts', 'contacts', 'contacts.deletedAt IS NULL')
    if(requestMaker.role !== RolesConst.ADMIN){
      query.andWhere('contacts.email = :email', { email: requestMaker.sub });
    }
    return query.getOne();
  }
  async filter(filters: CompanyQueryDTO, requestMaker): Promise<
    { pagination: any, records: Company[] }> {
    const query = await this.companyRepository.createQueryBuilder('company');
    query.andWhere('company.owner = :owner', { owner: requestMaker.owner });
    query.leftJoinAndSelect('company.securityContracts', 'securityContracts', 'securityContracts.deletedAt IS NULL')
    query.andWhere('securityContracts.enddate > :enddate OR securityContracts.enddate IS NULL', {enddate: new Date()});
    query.leftJoinAndSelect('company.confirmSets', 'confirmSets', 
    'confirmSets.deletedAt IS NULL AND confirmSets.owner = company.owner'
    )

    // ToDo: remove these lines
    // query.leftJoinAndSelect('confirmSets.segments', 'segments', 'segments.deletedAt IS NULL')
    // query.leftJoinAndSelect('segments.items', 'items', 'items.deletedAt IS NULL')
    query.leftJoinAndSelect('confirmSets.contacts', 'contacts', 'contacts.deletedAt IS NULL')
    query.andWhere('company.owner = :owner', { owner: requestMaker.owner });
    if(requestMaker.role !== RolesConst.ADMIN){
      query.andWhere('contacts.email = :email', { email: requestMaker.sub });
    }
    this.queryMaker({ ...filters }, query);
    const totalCount = await query.getCount();
    const skip = (parseInt(filters.page || '1', 10) - 1) * parseInt(filters.size || '20', 10);
    query.skip(skip)
    const limit = parseInt(filters.size || '20', 10)
    query.take(limit)
    const records = await (await query.getMany()).map((item)=> ({...item, securityContractValid: !!item.securityContracts?.length, securityContracts: undefined}));
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
    if (filters.name) {
      query.andWhere('company.name like :name', { name: `${filters.name}%` });
    }
    if (filters.businessId) {
      query.andWhere('company.businessId = :businessId', { businessId: filters.businessId });
    }
    if (filters.search) {
      query.andWhere('company.businessId like :search OR company.name like :search', { search: `${filters.search}%` });
    }
    if(filters.sortType && filters.sortProperty){
      query.orderBy(
        `company.${filters.sortProperty}`,
        filters.sortType === SortTypeEnum.ASCENDING ? 'ASC' : 'DESC'
      );
    }
    if (filters.from && filters.to){
      query.andWhere(`company.updatedAt BETWEEN :begin AND :end` ,{ begin: filters.from, end: filters.to});
    } else if(filters.from){
      query.andWhere('company.updatedAt > :updatedAt', { updatedAt: new Date(filters.from) });
    } else if(filters.to){
      query.andWhere('company.updatedAt < :updatedAt', { updatedAt: new Date(filters.to) });
    }
    return query;
  }
}