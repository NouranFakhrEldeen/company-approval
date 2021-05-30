import { Test } from '@nestjs/testing';
import { PassportModule } from '@nestjs/passport';
import { SegmentController } from '.';
import { SegmentService, RoleService, SegmentItemService } from '../services';
import { Segment } from '../entities';
const mockService = () => ({
  create: jest.fn(),
  update: jest.fn(),
  filter: jest.fn(),
  getById: jest.fn(),
  delete: jest.fn(),
  softDelete: jest.fn(),
});

describe('Segment Controller', () => {
  let controller;
  let service;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      controllers: [SegmentController],
      providers: [
        { provide: RoleService, useFactory: mockService },
        { provide: SegmentService, useFactory: mockService },
        { provide: SegmentItemService, useFactory: mockService },
      ],
    }).compile();

    controller = module.get<SegmentController>(SegmentController);
    service = module.get<SegmentService>(SegmentService);
  });
  it('save new segment', async () => {
    const expectedResult = new Segment();
    jest.spyOn(service, 'create').mockResolvedValue(expectedResult);
    expect(await controller.add('segment', 'user data')).toBe(expectedResult);
  });
  it('update segment', async () => {
    const expectedResult = new Segment();
    jest.spyOn(service, 'update').mockResolvedValue(expectedResult);
    expect(await controller.update('segment')).toBe(expectedResult);
  });
  it('filter segments', async () => {
    const expectedResult = [new Segment()];
    jest.spyOn(service, 'filter').mockResolvedValue(expectedResult);
    expect(await controller.query('query')).toBe(expectedResult);
  });
  it('find segment By Id', async () => {
    const expectedResult = new Segment();
    jest.spyOn(service, 'getById').mockResolvedValue(expectedResult);
    expect(await controller.findById('the id')).toBe(expectedResult);
  });
  it('delete segment By Id', async () => {
    const expectedResult = new Segment();
    jest.spyOn(service, 'softDelete').mockResolvedValue(expectedResult);
    expect(await controller.removeById('the id')).toBe(expectedResult);
  });
});
