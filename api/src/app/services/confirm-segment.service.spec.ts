import { HttpModule } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CertificateService, ConfirmSegmentService, DeviationService, InternalSyncService, SegmentItemService, SegmentService, SmtpServers } from '.';
import { SegmentCreateDTO, SegmentQueryDTO, SegmentUpdateDTO } from '../dto';
import { Certificate, Company, ConfirmSet, ConfirmSetSegment, ConfirmSetSegmentItem, Deviation, DeviationFeedbackHistory, Metadata, Segment, SegmentItem } from '../entities';
import { mockRepository } from '../helpers';
import { NodeMailerService } from '../smtp-servers/nodemailer.service';
import { CompanyService } from './company.service';
import { ConfirmSegmentItemService } from './confirm-segment-item.service';
import { ConfirmSetService } from './confirm-set.service';

describe('Confirm Segment Service', () => {
  let service;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports:[
        HttpModule,
      ],
      providers: [
        SegmentItemService,
        SegmentService,
        ConfirmSegmentService,
        ConfirmSetService,
        ConfirmSegmentItemService,
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
    service = module.get<ConfirmSegmentService>(ConfirmSegmentService);
  });
  it('create confirm segment', async () => {
    expect(await service.create(new SegmentCreateDTO(),'confirmId', {sub: 'email', owner: 'owner'})).toEqual(new ConfirmSetSegment());
  });
  it('update confirm segment', async () => {
    const id = '983cd7b8-4715-4087-8a96-252a4323ba58';
    const expectedValue = new ConfirmSetSegment();
    expect(await service.update(id, new SegmentUpdateDTO(),'confirmId', {owner: 'owner'})).toEqual(expectedValue);
  });
  it('find confirm segment By Id', async () => {
    const id = '983cd7b8-4715-4087-8a96-252a4323ba58';
    const expectedValue = new ConfirmSetSegment();
    expect(await service.getById(id,'confirmId', {owner: 'owner'})).toEqual(expectedValue);
  });
  it('delete confirm segment By Id', async () => {
    const id = '983cd7b8-4715-4087-8a96-252a4323ba58';
    const expectedValue = {deletedCount: 1, message: "Data deleted successfully"};
    expect(await service.delete(id,'confirmId', {owner: 'owner'})).toEqual(expectedValue);
  });
  it('filter confirm segment', async () => {
    const body: SegmentQueryDTO = {};
    const result = await service.filter(body,'confirmId', {owner: 'owner'});
    expect(result).toEqual({ 
      pagination: {
        count: 20,
        currentPage: 1,
        itemsPerPage: 20,
        total: 30,
        totalPages: 2,
      },
      records: new Array(20).fill(new ConfirmSetSegment())
    });
  });
  it('filter confirm segment (page and size)', async () => {
    const body: SegmentQueryDTO = {page: '2', size: '20'};
    const result = await service.filter(body,'confirmId', {owner: 'owner'});
    expect(result).toEqual({ 
      pagination: {
        count: 10,
        currentPage: 2,
        itemsPerPage: 20,
        total: 30,
        totalPages: 2,
      },
      records: new Array(10).fill(new ConfirmSetSegment())
    });
  });

});
