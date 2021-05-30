import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SegmentItemService, SegmentService } from '.';
import { SegmentItemCreateDTO, SegmentItemQueryDTO, SegmentItemUpdateDTO } from '../dto';
import { Segment, SegmentItem } from '../entities';
import { mockRepository } from '../helpers';

describe('Segment item Service', () => {
  let service;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        SegmentItemService,
        SegmentService,
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
    service = module.get<SegmentItemService>(SegmentItemService);
  });
  it('create segment item', async () => {
    expect(await service.create(new SegmentItemCreateDTO(),'segmentId', {sub: 'email', owner: 'owner'})).toEqual(new SegmentItem());
  });
  it('update segment item', async () => {
    const id = '983cd7b8-4715-4087-8a96-252a4323ba58';
    const expectedValue = new SegmentItem();
    expect(await service.update(id, new SegmentItemUpdateDTO(),'segmentId', {owner: 'owner'})).toEqual(expectedValue);
  });
  it('find segment item By Id', async () => {
    const id = '983cd7b8-4715-4087-8a96-252a4323ba58';
    const expectedValue = new SegmentItem();
    expect(await service.getById(id,'segmentId', {owner: 'owner'})).toEqual(expectedValue);
  });
  it('delete segment item By Id', async () => {
    const id = '983cd7b8-4715-4087-8a96-252a4323ba58';
    const expectedValue = {deletedCount: 1, message: "Data deleted successfully"};
    expect(await service.delete(id,'segmentId', {owner: 'owner'})).toEqual(expectedValue);
  });
  it('filter segment item', async () => {
    const body: SegmentItemQueryDTO = {};
    const result = await service.filter(body,'segmentId', {owner: 'owner'});
    expect(result).toEqual({ 
      pagination: {
        count: 20,
        currentPage: 1,
        itemsPerPage: 20,
        total: 30,
        totalPages: 2,
      },
      records: new Array(20).fill(new SegmentItem())
    });
  });
  it('filter segment item (page and size)', async () => {
    const body: SegmentItemQueryDTO = {page: '2', size: '20'};
    const result = await service.filter(body,'segmentId', {owner: 'owner'});
    expect(result).toEqual({ 
      pagination: {
        count: 10,
        currentPage: 2,
        itemsPerPage: 20,
        total: 30,
        totalPages: 2,
      },
      records: new Array(10).fill(new SegmentItem())
    });
  });

});
