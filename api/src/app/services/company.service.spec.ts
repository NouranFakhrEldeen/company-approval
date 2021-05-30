import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CompanyService, SecurityContractService } from '.';
import { CompanyCreateDTO, CompanyQueryDTO, CompanyUpdateDTO } from '../dto';
import { Company, SecurityContract } from '../entities';
import { mockRepository } from '../helpers';

describe('Company Service', () => {
  let service;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CompanyService,
        SecurityContractService,

        {
          provide: getRepositoryToken(Company),
          useValue: new mockRepository(Company),
        },
        {
          provide: getRepositoryToken(SecurityContract),
          useValue: new mockRepository(SecurityContract),
        },
        
       ],
    }).compile();
    service = module.get<CompanyService>(CompanyService);
  });
  it('create Company', async () => {
    expect(await service.create(new CompanyCreateDTO(), {sub: 'email', owner: 'owner'})).toEqual(new Company());
  });
  it('update Company', async () => {
    const id = '983cd7b8-4715-4087-8a96-252a4323ba58';
    const expectedValue = new Company();
    expect(await service.update(id, new CompanyUpdateDTO(), {owner: 'owner'})).toEqual(expectedValue);
  });
  it('find Company By Id', async () => {
    const id = '983cd7b8-4715-4087-8a96-252a4323ba58';
    const expectedValue = new Company();
    expect(await service.getById(id, {owner: 'owner'})).toEqual(expectedValue);
  });
  it('delete Company By Id', async () => {
    const id = '983cd7b8-4715-4087-8a96-252a4323ba58';
    const expectedValue = {deletedCount: 1, message: "Data deleted successfully"};
    expect(await service.delete(id, {owner: 'owner'})).toEqual(expectedValue);
  });
  it('filter companies', async () => {
    const body: CompanyQueryDTO = {};
    const result = await service.filter(body, {owner: 'owner'});
    expect(result).toEqual({ 
      pagination: {
        count: 20,
        currentPage: 1,
        itemsPerPage: 20,
        total: 30,
        totalPages: 2,
      },
      records: new Array(20).fill({...new Company(), securityContractValid: false})
    });
  });

  it('filter companies (page and size)', async () => {
    const body: CompanyQueryDTO = {page: '2', size: '20'};
    const result = await service.filter(body, {owner: 'owner'});
    expect(result).toEqual({ 
      pagination: {
        count: 10,
        currentPage: 2,
        itemsPerPage: 20,
        total: 30,
        totalPages: 2,
      },
      records: new Array(10).fill({...new Company(), securityContractValid: false})
    });
  });

});
