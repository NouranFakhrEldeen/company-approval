import { HttpService, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfirmSetContact } from '../entities';
import { InternalContactQueryDTO } from '../dto';
import { SortTypeEnum } from '../enums';
@Injectable()
export class InternalContactService {
  constructor(
    private readonly http: HttpService,
    @InjectRepository(ConfirmSetContact) private readonly confirmContactRepository: Repository<ConfirmSetContact>,
  ) { }

  async getById(id: string): Promise<any> {
    const query = await this.confirmContactRepository.createQueryBuilder('confirmContact');
    query.andWhere('confirmContact.id = :id', { id });
    query.leftJoinAndSelect('confirmContact.confirmSet', 'confirmSet', 'confirmSet.deletedAt IS NULL')
    query.leftJoinAndSelect('confirmSet.company', 'company', 'company.deletedAt IS NULL')
    const contact = await query.getOne();
    return contact ? {
      name: contact.name,
      phoneNumber: contact.phone,
      emailAddress: contact.email,
      roles: ['TR Palveluntuottaja'], 
      organization:{ 
        name: contact.confirmSet?.company.name,
        businessId: contact.confirmSet?.company.businessId,
        isForeign: false
      }
    } : undefined ;
  }
  async filter(filters: InternalContactQueryDTO): Promise<any[]> {
    const query = await this.confirmContactRepository.createQueryBuilder('confirmContact');
    query.leftJoinAndSelect('confirmContact.confirmSet', 'confirmSet', 'confirmSet.deletedAt IS NULL');
    query.leftJoinAndSelect('confirmSet.company', 'company', 'confirmSet.deletedAt IS NULL');
    this.queryMaker({ ...filters }, query);
    const contacts = await query.getMany();
    return contacts.map((item)=> ({
      name: item.name,
      phoneNumber: item.phone,
      emailAddress: item.email,
      roles: ['TR Palveluntuottaja'], 
      organization:{ 
        name: item.confirmSet?.company.name,
        businessId: item.confirmSet?.company.businessId,
        isForeign: false
      }
    }));
  }
  public async getCompined(){
    let internalContacts = [], extenalContacts = [];
    try {
      internalContacts = await this.filter({}) || [];
    } catch (e) {
      throw new InternalServerErrorException('company approval server not working');
    }
    try {
      extenalContacts = (await this.getExternalConatacts())?.data || [];
    } catch (e) {
      throw new InternalServerErrorException('external server not working');
    }
    extenalContacts = extenalContacts.map((item)=> ({...item, roles: item.roles || [item.role], role: undefined}))
    const output: { [key: string]: any;} = {}
    for(const contact of internalContacts){
      if(output[contact.emailAddress]){
        contact.roles = [...contact.roles, ...output[contact.emailAddress].roles]
      }
      output[contact.emailAddress] = contact;
    }
    for(const contact of extenalContacts){
      if(output[contact.emailAddress]){
        contact.roles = [...contact.roles, ...output[contact.emailAddress].roles]
      }
      output[contact.emailAddress] = contact;
    }
    const contacts = Object.values(output);
    for(const i in contacts){
      contacts[i].roles = [...new Set(contacts[i].roles)];
    }
    return contacts;
  }

  private async getExternalConatacts(): Promise<any>{
    const url = process.env.EXTERNAL_CONTACTS_API_URL;
    const username = process.env.EXTERNAL_CONTACTS_API_USERNAME;
    const password = process.env.EXTERNAL_CONTACTS_API_PASSWORD;
    if(!url || !username || !password){
      throw new InternalServerErrorException('external server not configured');
    }
    return await this.http.get(url, {
      headers:{
        Authorization: `Basic ${Buffer.from(username + ':' + password).toString('base64')}`,
      }
    }).toPromise();
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

}