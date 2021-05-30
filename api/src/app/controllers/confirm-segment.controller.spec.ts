import { Test } from '@nestjs/testing';
import { PassportModule } from '@nestjs/passport';
import { ConfirmSegmentController } from '.';
import { CompanyService, ConfirmSegmentItemService, ConfirmSegmentService, ConfirmSetService, RoleService } from '../services';
import { ConfirmSet } from '../entities';
const mockService = () => ({
  create: jest.fn(),
  update: jest.fn(),
  filter: jest.fn(),
  getById: jest.fn(),
  delete: jest.fn(),
  softDelete: jest.fn(),
});

describe('Confirm Segment Controller', () => {
  let controller;
  let service;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      controllers: [ConfirmSegmentController],
      providers: [
        { provide: CompanyService, useFactory: mockService },
        { provide: ConfirmSetService, useFactory: mockService },
        { provide: ConfirmSegmentItemService, useFactory: mockService },
        { provide: RoleService, useFactory: mockService },
        { provide: ConfirmSegmentService, useFactory: mockService },
      ],
    }).compile();

    controller = module.get<ConfirmSegmentController>(ConfirmSegmentController);
    service = module.get<ConfirmSegmentService>(ConfirmSegmentService);
  });
  it('save new confirm segment', async () => {
    const expectedResult = new ConfirmSet();
    jest.spyOn(service, 'create').mockResolvedValue(expectedResult);
    expect(await controller.add('confirm segment', 'user data')).toBe(expectedResult);
  });
  it('update confirm segment', async () => {
    const expectedResult = new ConfirmSet();
    jest.spyOn(service, 'update').mockResolvedValue(expectedResult);
    expect(await controller.update('confirm segment')).toBe(expectedResult);
  });
  it('filter confirm sets', async () => {
    const expectedResult = [new ConfirmSet()];
    jest.spyOn(service, 'filter').mockResolvedValue(expectedResult);
    expect(await controller.query('query')).toBe(expectedResult);
  });
  it('find confirm segment By Id', async () => {
    const expectedResult = new ConfirmSet();
    jest.spyOn(service, 'getById').mockResolvedValue(expectedResult);
    expect(await controller.findById('the id')).toBe(expectedResult);
  });
  it('delete confirm segment By Id', async () => {
    const expectedResult = new ConfirmSet();
    jest.spyOn(service, 'softDelete').mockResolvedValue(expectedResult);
    expect(await controller.removeById('the id')).toBe(expectedResult);
  });
});
