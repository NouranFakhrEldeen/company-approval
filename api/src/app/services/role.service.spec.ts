import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RoleService } from '.';
import { RoleCreateDTO, RoleQueryDTO, RoleUpdateDTO } from '../dto';
import { Role } from '../entities';
import { mockRepository } from '../helpers';

describe('Role Service', () => {
  let service;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        RoleService,
        {
          provide: getRepositoryToken(Role),
          useValue: new mockRepository(Role),
        },
       ],
    }).compile();
    service = module.get<RoleService>(RoleService);
  });
  it('create Role', async () => {
    expect(await service.create(new RoleCreateDTO(), {sub: 'email', owner: 'owner'})).toEqual(new Role());
  });
  it('update Role', async () => {
    const id = '983cd7b8-4715-4087-8a96-252a4323ba58';
    const expectedValue = new Role();
    expect(await service.update(id, new RoleUpdateDTO(), {owner: 'owner'})).toEqual(expectedValue);
  });
  it('find Role By Id', async () => {
    const id = '983cd7b8-4715-4087-8a96-252a4323ba58';
    const expectedValue = new Role();
    expect(await service.getById(id, {owner: 'owner'})).toEqual(expectedValue);
  });
  it('delete Role By Id', async () => {
    const id = '983cd7b8-4715-4087-8a96-252a4323ba58';
    const expectedValue = {deletedCount: 1, message: "Data deleted successfully"};
    expect(await service.delete(id, {owner: 'owner'})).toEqual(expectedValue);
  });
  it('filter roles', async () => {
    const body: RoleQueryDTO = {};
    const result = await service.filter(body, {owner: 'owner'});
    expect(result).toEqual({ 
      pagination: {
        count: 20,
        currentPage: 1,
        itemsPerPage: 20,
        total: 30,
        totalPages: 2,
      },
      records: new Array(20).fill(new Role())
    });
  });
  it('filter roles (page and size)', async () => {
    const body: RoleQueryDTO = {page: '2', size: '20'};
    const result = await service.filter(body, {owner: 'owner'});
    expect(result).toEqual({ 
      pagination: {
        count: 10,
        currentPage: 2,
        itemsPerPage: 20,
        total: 30,
        totalPages: 2,
      },
      records: new Array(10).fill(new Role())
    });
  });

});
