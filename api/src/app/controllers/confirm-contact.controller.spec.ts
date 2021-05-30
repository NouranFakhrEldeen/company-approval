import { Test } from '@nestjs/testing';
import { PassportModule } from '@nestjs/passport';
import { ConfirmContactController } from '.';
import { ConfirmContactService, RoleService } from '../services';
import { ConfirmSet } from '../entities';
const mockService = () => ({
  create: jest.fn(),
  update: jest.fn(),
  filter: jest.fn(),
  getById: jest.fn(),
  delete: jest.fn(),
  softDelete: jest.fn(),
});

describe('Confirm Contact Controller', () => {
  let controller;
  let service;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      controllers: [ConfirmContactController],
      providers: [
        { provide: RoleService, useFactory: mockService },
        { provide: ConfirmContactService, useFactory: mockService },
      ],
    }).compile();

    controller = module.get<ConfirmContactController>(ConfirmContactController);
    service = module.get<ConfirmContactService>(ConfirmContactService);
  });
  it('save new confirm contact', async () => {
    const expectedResult = new ConfirmSet();
    jest.spyOn(service, 'create').mockResolvedValue(expectedResult);
    expect(await controller.add('confirm contact', 'user data')).toBe(expectedResult);
  });
  it('update confirm contact', async () => {
    const expectedResult = new ConfirmSet();
    jest.spyOn(service, 'update').mockResolvedValue(expectedResult);
    expect(await controller.update('confirm contact')).toBe(expectedResult);
  });
  it('filter confirm sets', async () => {
    const expectedResult = [new ConfirmSet()];
    jest.spyOn(service, 'filter').mockResolvedValue(expectedResult);
    expect(await controller.query('query')).toBe(expectedResult);
  });
  it('find confirm contact By Id', async () => {
    const expectedResult = new ConfirmSet();
    jest.spyOn(service, 'getById').mockResolvedValue(expectedResult);
    expect(await controller.findById('the id')).toBe(expectedResult);
  });
  it('delete confirm contact By Id', async () => {
    const expectedResult = new ConfirmSet();
    jest.spyOn(service, 'softDelete').mockResolvedValue(expectedResult);
    expect(await controller.removeById('the id')).toBe(expectedResult);
  });
});
