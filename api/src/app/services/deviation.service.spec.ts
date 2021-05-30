import { HttpModule } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  CertificateService,
  ConfirmSegmentItemService,
  ConfirmSegmentService,
  ConfirmSetService,
  DeviationService,
  InternalSyncService,
  SegmentItemService,
  SegmentService,
  SmtpServers,
} from '.';
import { DeviationQueryDTO, DeviationFixDTO, DeviationReviewDTO } from '../dto';
import { 
  Certificate,
  Company,
  Deviation,
  Metadata,
  Segment,
  SegmentItem,
  ConfirmSetSegment,
  ConfirmSetSegmentItem,
  ConfirmSet,
  DeviationFeedbackHistory,
} from '../entities';
import { ConfirmSetStatusEnum, DeviationStatusEnum } from '../enums';
import { mockRepository } from '../helpers';
import { NodeMailerService } from '../smtp-servers/nodemailer.service';
import { CompanyService } from './company.service';

describe('Deviation Service', () => {
  let service;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports:[
        HttpModule,
      ],
      providers: [
        DeviationService,
        ConfirmSegmentService,
        ConfirmSegmentItemService,
        CompanyService,
        CertificateService,
        InternalSyncService,
        SegmentItemService,
        SegmentService,
        DeviationService,
        ConfirmSetService,
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
          provide: getRepositoryToken(ConfirmSet),
          useValue: new mockRepository(ConfirmSet),
        },
        {
          provide: getRepositoryToken(Deviation),
          useValue: new mockRepository(Deviation),
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
          provide: getRepositoryToken(ConfirmSetSegment),
          useValue: new mockRepository(ConfirmSetSegment),
        },
        {
          provide: getRepositoryToken(ConfirmSetSegmentItem),
          useValue: new mockRepository(ConfirmSetSegmentItem),
        },
        {
          provide: getRepositoryToken(Segment),
          useValue: new mockRepository(Segment),
        },
        {
          provide: getRepositoryToken(SegmentItem),
          useValue: new mockRepository(SegmentItem),
        },
        {
          provide: getRepositoryToken(Company),
          useValue: new mockRepository(Company),
        },
      ],
    }).compile();
    service = module.get<DeviationService>(DeviationService);
  });

  it('fix Deviation', async () => {
    const id = '983cd7b8-4715-4087-8a96-252a4323ba58';
    const expectedValue = {status: DeviationStatusEnum.IN_FIXING};
    service.getById = ()=> ({status: DeviationStatusEnum.IN_FIXING})
    expect(await service.fix(
      {id, confirmSetId: id, deviation:new DeviationFixDTO(), requestMaker:{owner: 'owner'}}
    )).toEqual(expectedValue);
  });
  it('review Deviation', async () => {
    const id = '983cd7b8-4715-4087-8a96-252a4323ba58';
    const expectedValue = { confirmSetSegment: { confirmSet : {status: ConfirmSetStatusEnum.IN_DEVIATION_PROCESSING } } };
    service.getById = ()=> ({ confirmSetSegment: { confirmSet : {status: ConfirmSetStatusEnum.IN_DEVIATION_PROCESSING } } })
    service.internalSyncService.updateAudit = ()=> true;
    expect(await service.review(
      {id, confirmSetId: id, deviation:new DeviationReviewDTO(), requestMaker:{owner: 'owner'}}
    )).toEqual(expectedValue);
  });
  it('find Deviation By Id', async () => {
    const id = '983cd7b8-4715-4087-8a96-252a4323ba58';
    const expectedValue = new Deviation();
    expect(await service.getById(id, 'confirmSetId', {owner: 'owner'})).toEqual(expectedValue);
  });
  it('filter Deviation', async () => {
    const body: DeviationQueryDTO = {};
    const result = await service.filter(body, 'confirmSetId', {owner: 'owner'});
    expect(result).toEqual({ 
      pagination: {
        count: 20,
        currentPage: 1,
        itemsPerPage: 20,
        total: 30,
        totalPages: 2,
      },
      records: new Array(20).fill(new Deviation())
    });
  });
  it('filter Deviation (page and size)', async () => {
    const body: DeviationQueryDTO = {page: '2', size: '20'};
    const result = await service.filter(body, 'confirmSetId', {owner: 'owner'});
    expect(result).toEqual({ 
      pagination: {
        count: 10,
        currentPage: 2,
        itemsPerPage: 20,
        total: 30,
        totalPages: 2,
      },
      records: new Array(10).fill(new Deviation())
    });
  });

});
