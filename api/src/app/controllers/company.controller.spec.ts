import { Test } from '@nestjs/testing';
import { PassportModule } from '@nestjs/passport';
import { CompanyController } from './';
import { CompanyService, RoleService, SecurityContractService } from '../services';
import { Company } from '../entities';
const mockService = () => ({
  create: jest.fn(),
  update: jest.fn(),
  filter: jest.fn(),
  getById: jest.fn(),
  delete: jest.fn(),
  softDelete: jest.fn(),
});

describe('Company Controller', () => {
  let controller;
  let service;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      controllers: [CompanyController],
      providers: [
        { provide: RoleService, useFactory: mockService },
        { provide: CompanyService, useFactory: mockService },
        { provide: SecurityContractService, useFactory: mockService },
      ],
    }).compile();

    controller = module.get<CompanyController>(CompanyController);
    service = module.get<CompanyService>(CompanyService);
  });
  it('save new company', async () => {
    const expectedResult = new Company();
    jest.spyOn(service, 'create').mockResolvedValue(expectedResult);
    expect(await controller.add('company', 'user data')).toBe(expectedResult);
  });
  it('update company', async () => {
    const expectedResult = new Company();
    jest.spyOn(service, 'update').mockResolvedValue(expectedResult);
    expect(await controller.update('company')).toBe(expectedResult);
  });
  it('filter companies', async () => {
    const expectedResult = [new Company()];
    jest.spyOn(service, 'filter').mockResolvedValue(expectedResult);
    expect(await controller.query('query')).toBe(expectedResult);
  });
  it('find company By Id', async () => {
    const expectedResult = new Company();
    jest.spyOn(service, 'getById').mockResolvedValue(expectedResult);
    expect(await controller.findById('the id')).toBe(expectedResult);
  });
  it('delete company By Id', async () => {
    const expectedResult = new Company();
    jest.spyOn(service, 'softDelete').mockResolvedValue(expectedResult);
    expect(await controller.removeById('the id')).toBe(expectedResult);
  });
});
