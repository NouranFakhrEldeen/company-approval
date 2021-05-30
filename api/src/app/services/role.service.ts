import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../entities';
import { RoleCreateDTO, RoleQueryDTO, RoleUpdateDTO} from '../dto';
import { ErrorHandler } from '../helpers';
import { SortTypeEnum } from '../enums';
import { ErrorMessagesKeys } from '../../infrastructure';

@Injectable()
export class RoleService {
  private readonly errorHandler: ErrorHandler = ErrorHandler.getInstance();
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
  ) {}

  async create(roleData: RoleCreateDTO, requestMaker): Promise<any> {
    const role = this.roleRepository.create([{...roleData, owner: requestMaker.owner, creator: requestMaker.sub}]);
    try{
      await this.roleRepository.save(role);
    } catch(e){
      if (this.errorHandler.isUniqueKeyViolation(e)) {
        throw new ConflictException(
          this.errorHandler.getErrorMessage(ErrorMessagesKeys.ROLE_DUPLICATION),
        );
      } else {
        throw e;
      }
    }
    return await this.getById(role[0].id, requestMaker);
  }
  async update(id:string, roleData: RoleUpdateDTO, requestMaker): Promise<Role> {
    try {
      await this.roleRepository.update({ id, owner: requestMaker.owner }, roleData);
    } catch (e) {
      if (this.errorHandler.isUniqueKeyViolation(e)) {
        throw new ConflictException(
          this.errorHandler.getErrorMessage(ErrorMessagesKeys.ROLE_DUPLICATION),
        );
      } else {
        throw e;
      }
    }
    return await this.getById(id, requestMaker);
  }
  async delete(id: string, requestMaker): Promise<{ message: string, deletedCount: number }> {
    const response = await this.roleRepository.delete({ id, owner: requestMaker.owner });
    return {
      message: response.affected ? 'Data deleted successfully' : 'no item to delete',
      deletedCount: response.affected,
    };
  }
  async softDelete(id: string, requestMaker): Promise<{ message: string}> {
    const parent = await this.getById(id, requestMaker); 
    parent && await this.roleRepository.softRemove(parent);  
    return { message: parent ? 'Data deleted successfully' : 'no item to delete' };
  }
  async getById(id: string, requestMaker): Promise<Role> {
    return await this.roleRepository.findOne({ where: { id, owner: requestMaker.owner } });
  }
  // used only by sytem
  async getByName(name: string, owner: string): Promise<Role> {
    return await this.roleRepository.findOne({ where: { name, owner } });
  }
  async filter(filters: RoleQueryDTO, requestMaker): Promise<
  {pagination: any, records: Role[]}> {
    const query = await this.roleRepository.createQueryBuilder('role');
    query.andWhere('role.owner = :owner', {owner: requestMaker.owner});
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
    if(filters.name){
      query.andWhere('role.name like :name', {name: `${filters.name}%`});
    }
    if(filters.scope){
      query.andWhere('role.scopes like :scope', {scope: filters.scope});
    }
    if(filters.sortType && filters.sortProperty){
      query.orderBy(
        `role.${filters.sortProperty}`,
        filters.sortType === SortTypeEnum.ASCENDING ? 'ASC' : 'DESC'
      );
    }
    if (filters.from && filters.to){
      query.andWhere(`role.updatedAt BETWEEN :begin AND :end` ,{ begin: filters.from, end: filters.to});
    } else if(filters.from){
      query.andWhere('role.updatedAt > :updatedAt', { updatedAt: new Date(filters.from) });
    } else if(filters.to){
      query.andWhere('role.updatedAt < :updatedAt', { updatedAt: new Date(filters.to) });
    }
    return query;
  }
}