import { Test } from '@nestjs/testing';
import { PassportModule } from '@nestjs/passport';
import { RoleController } from './';
import { RoleService } from '../services';
import { Role } from '../entities';
const mockService = () => ({
  create: jest.fn(),
  update: jest.fn(),
  filter: jest.fn(),
  getById: jest.fn(),
  delete: jest.fn(),
  softDelete: jest.fn(),
});

describe('Role Controller', () => {
  let controller;
  let service;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      controllers: [RoleController],
      providers: [
        { provide: RoleService, useFactory: mockService },
      ],
    }).compile();

    controller = module.get<RoleController>(RoleController);
    service = module.get<RoleService>(RoleService);
  });
  it('save new role', async () => {
    const expectedResult = new Role();
    jest.spyOn(service, 'create').mockResolvedValue(expectedResult);
    expect(await controller.add('role', 'user data')).toBe(expectedResult);
  });
  it('update role', async () => {
    const expectedResult = new Role();
    jest.spyOn(service, 'update').mockResolvedValue(expectedResult);
    expect(await controller.update('role')).toBe(expectedResult);
  });
  it('filter roles', async () => {
    const expectedResult = [new Role()];
    jest.spyOn(service, 'filter').mockResolvedValue(expectedResult);
    expect(await controller.query('query')).toBe(expectedResult);
  });
  it('find role By Id', async () => {
    const expectedResult = new Role();
    jest.spyOn(service, 'getById').mockResolvedValue(expectedResult);
    expect(await controller.findById('the id')).toBe(expectedResult);
  });
  it('delete role By Id', async () => {
    const expectedResult = new Role();
    jest.spyOn(service, 'softDelete').mockResolvedValue(expectedResult);
    expect(await controller.removeById('the id')).toBe(expectedResult);
  });
});
