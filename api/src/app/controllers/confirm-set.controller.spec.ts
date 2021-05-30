import { Test } from '@nestjs/testing';
import { PassportModule } from '@nestjs/passport';
import { ConfirmSetController } from '.';
import { ConfirmSetService, RoleService } from '../services';
import { ConfirmSet } from '../entities';
const mockService = () => ({
  create: jest.fn(),
  update: jest.fn(),
  filter: jest.fn(),
  getById: jest.fn(),
  delete: jest.fn(),
  softDelete: jest.fn(),
});

describe('Confirm Set Controller', () => {
  let controller;
  let service;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      controllers: [ConfirmSetController],
      providers: [
        { provide: RoleService, useFactory: mockService },
        { provide: ConfirmSetService, useFactory: mockService },
      ],
    }).compile();

    controller = module.get<ConfirmSetController>(ConfirmSetController);
    service = module.get<ConfirmSetService>(ConfirmSetService);
  });
  it('save new confirm set', async () => {
    const expectedResult = new ConfirmSet();
    jest.spyOn(service, 'create').mockResolvedValue(expectedResult);
    expect(await controller.add('confirm set', 'user data')).toBe(expectedResult);
  });
  it('update confirm set', async () => {
    const expectedResult = new ConfirmSet();
    jest.spyOn(service, 'update').mockResolvedValue(expectedResult);
    expect(await controller.update('confirm set')).toBe(expectedResult);
  });
  it('filter confirm sets', async () => {
    const expectedResult = [new ConfirmSet()];
    jest.spyOn(service, 'filter').mockResolvedValue(expectedResult);
    expect(await controller.query('query')).toBe(expectedResult);
  });
  it('find confirm set By Id', async () => {
    const expectedResult = new ConfirmSet();
    jest.spyOn(service, 'getById').mockResolvedValue(expectedResult);
    expect(await controller.findById('the id')).toBe(expectedResult);
  });
  it('delete confirm set By Id', async () => {
    const expectedResult = new ConfirmSet();
    jest.spyOn(service, 'softDelete').mockResolvedValue(expectedResult);
    expect(await controller.removeById('the id')).toBe(expectedResult);
  });
});
