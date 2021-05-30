import { HttpModule } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CertificateService, CompanyService, ConfirmSegmentItemService, ConfirmSegmentService, ConfirmSetService, DeviationService, InternalSyncService, SegmentItemService, SegmentService, SmtpServers } from '.';
import { ConfirmSegmentItemCreateDTO, ConfirmSegmentItemQueryDTO } from '../dto';
import { Certificate, Company, ConfirmSet, ConfirmSetSegment, ConfirmSetSegmentItem, Deviation, DeviationFeedbackHistory, Metadata, Segment, SegmentItem } from '../entities';
import { mockRepository } from '../helpers';
import { NodeMailerService } from '../smtp-servers/nodemailer.service';

describe('Confirm Segment item Service', () => {
  let service;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports:[
        HttpModule,
      ],
      providers: [
        SegmentItemService,
        SegmentService,
        ConfirmSegmentItemService,
        ConfirmSegmentService,
        ConfirmSetService,
        CompanyService,
        CertificateService,
        InternalSyncService,
        DeviationService,
        SmtpServers,
        NodeMailerService,
        {
          provide: getRepositoryToken(DeviationFeedbackHistory),
          useValue: new mockRepository(DeviationFeedbackHistory),
        },
        {
          provide: getRepositoryToken(Deviation),
          useValue: new mockRepository(Deviation),
        },
        {
          provide: getRepositoryToken(SegmentItem),
          useValue: new mockRepository(SegmentItem),
        },
        {
          provide: getRepositoryToken(Metadata),
          useValue: new mockRepository(Metadata),
        },
        {
          provide: getRepositoryToken(Certificate),
          useValue: new mockRepository(Certificate),
        },
        {
          provide: getRepositoryToken(Segment),
          useValue: new mockRepository(Segment),
        },
        {
          provide: getRepositoryToken(ConfirmSetSegmentItem),
          useValue: new mockRepository(ConfirmSetSegmentItem),
        },
        {
          provide: getRepositoryToken(ConfirmSetSegment),
          useValue: new mockRepository(ConfirmSetSegment),
        },
        {
          provide: getRepositoryToken(ConfirmSet),
          useValue: new mockRepository(ConfirmSet),
        },
        {
          provide: getRepositoryToken(Company),
          useValue: new mockRepository(Company),
        },
       ],
    }).compile();
    service = module.get<ConfirmSegmentItemService>(ConfirmSegmentItemService);
  });
  it('create segment item', async () => {
    expect(await service.create(new ConfirmSegmentItemCreateDTO(),'confirmId', 'segmentId', {sub: 'email', owner: 'owner'})).toEqual(new ConfirmSetSegmentItem());
  });
  it('update segment item', async () => {
    const id = '983cd7b8-4715-4087-8a96-252a4323ba58';
    const expectedValue = new ConfirmSetSegmentItem();
    expect(await service.update(id, new ConfirmSegmentItemCreateDTO(),'confirmId', 'segmentId', {owner: 'owner'})).toEqual(expectedValue);
  });
  it('find segment item By Id', async () => {
    const id = '983cd7b8-4715-4087-8a96-252a4323ba58';
    const expectedValue = new ConfirmSetSegmentItem();
    expect(await service.getById(id,'confirmId', 'segmentId', {owner: 'owner'})).toEqual(expectedValue);
  });
  it('delete segment item By Id', async () => {
    const id = '983cd7b8-4715-4087-8a96-252a4323ba58';
    const expectedValue = {deletedCount: 1, message: "Data deleted successfully"};
    expect(await service.delete(id,'confirmId', 'segmentId', {owner: 'owner'})).toEqual(expectedValue);
  });
  it('filter segment item', async () => {
    const body: ConfirmSegmentItemQueryDTO = {};
    const result = await service.filter(body,'confirmId', 'segmentId', {owner: 'owner'});
    expect(result).toEqual({ 
      pagination: {
        count: 20,
        currentPage: 1,
        itemsPerPage: 20,
        total: 30,
        totalPages: 2,
      },
      records: new Array(20).fill(new ConfirmSetSegmentItem())
    });
  });
  it('filter segment item (page and size)', async () => {
    const body: ConfirmSegmentItemQueryDTO = {page: '2', size: '20'};
    const result = await service.filter(body,'confirmId', 'segmentId', {owner: 'owner'});
    expect(result).toEqual({ 
      pagination: {
        count: 10,
        currentPage: 2,
        itemsPerPage: 20,
        total: 30,
        totalPages: 2,
      },
      records: new Array(10).fill(new ConfirmSetSegmentItem())
    });
  });

});
