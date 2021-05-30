import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SecurityContract } from '../entities';
import { SecurityContractQueryDTO} from '../dto';
import { ErrorHandler } from '../helpers';
import { SortTypeEnum } from '../enums';

@Injectable()
export class SecurityContractService {
  private readonly errorHandler: ErrorHandler = ErrorHandler.getInstance();
  constructor(
    @InjectRepository(SecurityContract) private readonly securityContractRepository: Repository<SecurityContract>,
  ) {}
  async getById(id: string, requestMaker): Promise<SecurityContract> {
    return await this.securityContractRepository.findOne({ where: { id, owner: requestMaker.owner } });
  }

  async filter(filters: SecurityContractQueryDTO, requestMaker): Promise<
  {pagination: any, records: SecurityContract[]}> {
    const query = await this.securityContractRepository.createQueryBuilder('securityContract');
    query.andWhere('securityContract.owner = :owner', {owner: requestMaker.owner});
    this.queryMaker({...filters}, query);
    const totalCount = await query.getCount()
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
        totalPages: Math.ceil(totalCount/limit),
        currentPage: parseInt(filters.page || '1', 10),
        total: totalCount,
      }
    }
  }

  private async queryMaker(filters, query){
    if(filters.service_provider_name){
      query.andWhere('securityContract.service_provider_name like :name', {name: `${filters.service_provider_name}%`});
    }
    if(filters.service_provider_business_id){
      query.andWhere('securityContract.service_provider_business_id = :id', {id: filters.service_provider_business_id});
    }
    if(filters.service_provider_vat_id){
      query.andWhere('securityContract.service_provider_vat_id = :id', {id: filters.service_provider_vat_id});
    }
    if(filters.contract_number){
      query.andWhere('securityContract.contract_number = :no', {no: filters.contract_number});
    }
    if(filters.contract_name){
      query.andWhere('securityContract.contract_name = :name', {name: filters.contract_name});
    }
    if(filters.name_public){
      query.andWhere('securityContract.name_public = :name', {name: filters.name_public});
    }
    if(filters.sortType && filters.sortProperty){
      query.orderBy(
        `securityContract.${filters.sortProperty}`,
        filters.sortType === SortTypeEnum.ASCENDING ? 'ASC' : 'DESC'
      );
    }
    if (filters.from && filters.to){
      query.andWhere(`securityContract.updatedAt BETWEEN :begin AND :end` ,{ begin: filters.from, end: filters.to});
    } else if(filters.from){
      query.andWhere('securityContract.updatedAt > :updatedAt', { updatedAt: new Date(filters.from) });
    } else if(filters.to){
      query.andWhere('securityContract.updatedAt < :updatedAt', { updatedAt: new Date(filters.to) });
    }
    if (filters.fromStartdate && filters.toStartdate){
      query.andWhere(`securityContract.startdate BETWEEN :begin AND :end` ,{ begin: new Date(filters.fromStartdate), end: new Date(filters.toStartdate)});
    } else if(filters.fromStartdate){
      query.andWhere('securityContract.startdate > :startdate', { startdate: new Date(filters.fromStartdate) });
    } else if(filters.toStartdate){
      query.andWhere('securityContract.startdate < :startdate', { startdate: new Date(filters.toStartdate) });
    }

    if (filters.fromEnddate && filters.toEnddate){
      query.andWhere(`securityContract.enddate BETWEEN :begin AND :end` ,{ begin: new Date(filters.fromEnddate), end: new Date(filters.toEnddate)});
    } else if(filters.fromEnddate){
      query.andWhere('securityContract.enddate > :enddate', { enddate: new Date(filters.fromEnddate) });
    } else if(filters.toEnddate){
      query.andWhere('securityContract.enddate < :enddate', { enddate: new Date(filters.toEnddate) });
    }
    return query;
  }
}