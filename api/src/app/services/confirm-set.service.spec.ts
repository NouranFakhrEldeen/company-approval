import { HttpModule } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CertificateService, ConfirmSegmentItemService, ConfirmSegmentService, ConfirmSetService, InternalSyncService, SegmentItemService, SegmentService, SmtpServers } from '.';
import { ConfirmSetCreateDTO, ConfirmSetQueryDTO, ConfirmSetUpdateDTO } from '../dto';
import { Certificate, Company, ConfirmSet, ConfirmSetSegment, ConfirmSetSegmentItem, Deviation, DeviationFeedbackHistory, Metadata, Segment, SegmentItem } from '../entities';
import { mockRepository } from '../helpers';
import { NodeMailerService } from '../smtp-servers/nodemailer.service';
import { CompanyService } from './company.service';
import { DeviationService } from './deviation.service';

describe('Confirm Set Service', () => {
  let service;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports:[
        HttpModule,
      ],
      providers: [
        ConfirmSetService,
        ConfirmSegmentService,
        ConfirmSegmentItemService,
        CompanyService,
        CertificateService,
        InternalSyncService,
        SegmentItemService,
        SegmentService,
        DeviationService,
        SmtpServers,
        NodeMailerService,
        {
          provide: getRepositoryToken(DeviationFeedbackHistory),
          useValue: new mockRepository(DeviationFeedbackHistory),
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
    service = module.get<ConfirmSetService>(ConfirmSetService);
  });
  it('create confirm set', async () => {
    expect(await service.create(new ConfirmSetCreateDTO(), {sub: 'email', owner: 'owner'})).toEqual(new ConfirmSet());
  });
  it('update confirm set', async () => {
    const id = '983cd7b8-4715-4087-8a96-252a4323ba58';
    const expectedValue = new ConfirmSet();
    expect(await service.update(id, new ConfirmSetUpdateDTO(), {owner: 'owner'})).toEqual(expectedValue);
  });
  it('find confirm set By Id', async () => {
    const id = '983cd7b8-4715-4087-8a96-252a4323ba58';
    const expectedValue = new ConfirmSet();
    expect(await service.getById(id, {owner: 'owner'})).toEqual(expectedValue);
  });
  it('delete confirm set By Id', async () => {
    const id = '983cd7b8-4715-4087-8a96-252a4323ba58';
    const expectedValue = {deletedCount: 1, message: "Data deleted successfully"};
    expect(await service.delete(id, {owner: 'owner'})).toEqual(expectedValue);
  });
  it('filter confirm set', async () => {
    const body: ConfirmSetQueryDTO = {};
    const result = await service.filter(body, {owner: 'owner'});
    expect(result).toEqual({ 
      pagination: {
        statusCount: {},
        count: 20,
        currentPage: 1,
        itemsPerPage: 20,
        total: 30,
        totalPages: 2,
      },
      records: new Array(20).fill(new ConfirmSet())
    });
  });
  it('filter confirm set (page and size)', async () => {
    const body: ConfirmSetQueryDTO = {page: '2', size: '20'};
    const result = await service.filter(body, {owner: 'owner'});
    expect(result).toEqual({ 
      pagination: {
        statusCount: {},
        count: 10,
        currentPage: 2,
        itemsPerPage: 20,
        total: 30,
        totalPages: 2,
      },
      records: new Array(10).fill(new ConfirmSet())
    });
  });

});
