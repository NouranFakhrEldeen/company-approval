import { HttpModule } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Certificate } from 'crypto';
import { CertificateService, CompanyService, ConfirmContactService, ConfirmSegmentItemService, ConfirmSegmentService, ConfirmSetService, DeviationService, InternalSyncService, SegmentItemService, SegmentService, SmtpServers } from '.';
import { ConfirmContactCreateDTO, ConfirmContactQueryDTO, ConfirmContactUpdateDTO } from '../dto';
import { Company, ConfirmSet, ConfirmSetContact, ConfirmSetSegment, ConfirmSetSegmentItem, Deviation, DeviationFeedbackHistory, Metadata, Segment, SegmentItem } from '../entities';
import { mockRepository } from '../helpers';
import { NodeMailerService } from '../smtp-servers/nodemailer.service';

describe('ConfirmSetContact Service', () => {
  let service;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports:[
        HttpModule,
      ],
      providers: [
        SegmentItemService,
        SegmentService,
        ConfirmContactService,
        CompanyService,
        ConfirmSetService,
        ConfirmSegmentService,
        ConfirmSegmentItemService,
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
          provide: getRepositoryToken(ConfirmSetContact),
          useValue: new mockRepository(ConfirmSetContact),
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
          provide: getRepositoryToken(Company),
          useValue: new mockRepository(Company),
        },
        {
          provide: getRepositoryToken(ConfirmSet),
          useValue: new mockRepository(ConfirmSet),
        },
        {
          provide: getRepositoryToken(ConfirmSetSegment),
          useValue: new mockRepository(ConfirmSetSegment),
        },
        {
          provide: getRepositoryToken(ConfirmSetSegmentItem),
          useValue: new mockRepository(ConfirmSetSegmentItem),
        },
       ],
    }).compile();
    service = module.get<ConfirmContactService>(ConfirmContactService);
  });
  it('create ConfirmSetContact', async () => {
    expect(await service.create(new ConfirmContactCreateDTO(),'segmentId', {sub: 'email', owner: 'owner'})).toEqual(new ConfirmSetContact());
  });
  it('update ConfirmSetContact', async () => {
    const id = '983cd7b8-4715-4087-8a96-252a4323ba58';
    const expectedValue = new ConfirmSetContact();
    expect(await service.update(id, new ConfirmContactUpdateDTO(),'segmentId', {owner: 'owner'})).toEqual(expectedValue);
  });
  it('find ConfirmSetContact By Id', async () => {
    const id = '983cd7b8-4715-4087-8a96-252a4323ba58';
    const expectedValue = new ConfirmSetContact();
    expect(await service.getById(id,'segmentId', {owner: 'owner'})).toEqual(expectedValue);
  });
  it('delete ConfirmSetContact By Id', async () => {
    const id = '983cd7b8-4715-4087-8a96-252a4323ba58';
    const expectedValue = {deletedCount: 1, message: "Data deleted successfully"};
    expect(await service.delete(id,'segmentId', {owner: 'owner'})).toEqual(expectedValue);
  });
  it('filter companies', async () => {
    const body: ConfirmContactQueryDTO = {};
    const result = await service.filter(body,'segmentId', {owner: 'owner'});
    expect(result).toEqual({ 
      pagination: {
        count: 20,
        currentPage: 1,
        itemsPerPage: 20,
        total: 30,
        totalPages: 2,
      },
      records: new Array(20).fill(new ConfirmSetContact())
    });
  });
  it('filter companies (page and size)', async () => {
    const body: ConfirmContactQueryDTO = {page: '2', size: '20'};
    const result = await service.filter(body,'segmentId', {owner: 'owner'});
    expect(result).toEqual({ 
      pagination: {
        count: 10,
        currentPage: 2,
        itemsPerPage: 20,
        total: 30,
        totalPages: 2,
      },
      records: new Array(10).fill(new ConfirmSetContact())
    });
  });

});
