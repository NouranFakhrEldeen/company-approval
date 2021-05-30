import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SegmentItemService, SegmentService } from '.';
import { SegmentCreateDTO, SegmentQueryDTO, SegmentUpdateDTO } from '../dto';
import { Segment, SegmentItem } from '../entities';
import { mockRepository } from '../helpers';

describe('Segment Service', () => {
  let service;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        SegmentService,
        SegmentItemService,
        {
          provide: getRepositoryToken(SegmentItem),
          useValue: new mockRepository(SegmentItem),
        },
        {
          provide: getRepositoryToken(Segment),
          useValue: new mockRepository(Segment),
        },
       ],
    }).compile();
    service = module.get<SegmentService>(SegmentService);
  });
  it('create segment', async () => {
    expect(await service.create(new SegmentCreateDTO(), {sub: 'email', owner: 'owner'})).toEqual(new Segment());
  });
  it('update segment', async () => {
    const id = '983cd7b8-4715-4087-8a96-252a4323ba58';
    const expectedValue = new Segment();
    expect(await service.update(id, new SegmentUpdateDTO(), {owner: 'owner'})).toEqual(expectedValue);
  });
  it('find segment By Id', async () => {
    const id = '983cd7b8-4715-4087-8a96-252a4323ba58';
    const expectedValue = new Segment();
    expect(await service.getById(id, {owner: 'owner'})).toEqual(expectedValue);
  });
  it('delete segment By Id', async () => {
    const id = '983cd7b8-4715-4087-8a96-252a4323ba58';
    const expectedValue = {deletedCount: 1, message: "Data deleted successfully"};
    expect(await service.delete(id, {owner: 'owner'})).toEqual(expectedValue);
  });
  it('filter segment', async () => {
    const body: SegmentQueryDTO = {};
    const result = await service.filter(body, {owner: 'owner'});
    expect(result).toEqual({ 
      pagination: {
        count: 20,
        currentPage: 1,
        itemsPerPage: 20,
        total: 30,
        totalPages: 2,
      },
      records: new Array(20).fill(new Segment())
    });
  });
  it('filter segment (page and size)', async () => {
    const body: SegmentQueryDTO = {page: '2', size: '20'};
    const result = await service.filter(body, {owner: 'owner'});
    expect(result).toEqual({ 
      pagination: {
        count: 10,
        currentPage: 2,
        itemsPerPage: 20,
        total: 30,
        totalPages: 2,
      },
      records: new Array(10).fill(new Segment())
    });
  });

});
