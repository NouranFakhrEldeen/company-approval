import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { CertificateService, ConfirmSegmentItemService, ConfirmSegmentService, ConfirmSetService, InternalSyncService, SegmentItemService, SegmentService, SmtpServers } from './';
import { ConfirmSet, Certificate, ConfirmSetSegment, ConfirmSetSegmentItem, Segment, Company, Metadata, SegmentItem, Deviation } from '../entities';
import { mockRepository } from '../helpers';
import { CompanyService } from './company.service';
import { HttpModule } from '@nestjs/common';
import { NodeMailerService } from '../smtp-servers/nodemailer.service';

describe('Certificate Service', () => {
  let service, confirmSetService, companyService;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports:[
        HttpModule,
      ],
      providers: [
        CertificateService,
        ConfirmSetService,
        ConfirmSegmentService,
        ConfirmSegmentItemService,
        InternalSyncService,
        CompanyService,
        SegmentService,
        SegmentItemService,
        SmtpServers,
        NodeMailerService,
        {
          provide: getRepositoryToken(Deviation),
          useValue: new mockRepository(Deviation),
        },
        {
          provide: getRepositoryToken(ConfirmSet),
          useValue: new mockRepository(ConfirmSet),
        },
        {
          provide: getRepositoryToken(Metadata),
          useValue: new mockRepository(Metadata),
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
        {
          provide: getRepositoryToken(Certificate),
          useValue: new mockRepository(Certificate),
        },
       ],
    }).compile();
    service = module.get<CertificateService>(CertificateService);
    confirmSetService = module.get<ConfirmSetService>(ConfirmSetService);
    companyService = module.get<CompanyService>(CompanyService);
    
  });
  it('add a valid file file (local)', async () => {
    const file = {
        mimetype: 'application/pdf',
        originalname: 'test.pdf',
    };
    confirmSetService.getById = async () => ('data');
    confirmSetService.filter = async () => ({records: [{}]});
    companyService.getById = async () => ('data');
    companyService.filter = async () => ({records: [{}]});
    service.getConfirmSet = async () => ({records: [{}]});
    expect(!!(await service.addCertificate({file, type: 'local', user:{}, mimes: ['application/pdf']}))).toEqual(true);
  });

  it('add not valid file (local)', async () => {
    const file = {
        mimetype: 'imgage/jpg',
        originalname: 'test.jpg',
    };
    confirmSetService.getById = async () => ('data');
    confirmSetService.filter = async () => ({records: []});
    companyService.getById = async () => ('data');
    companyService.filter = async () => ({records: []});
    expect(service.addCertificate({file, type: 'local', user:{}, mimes: ['application/pdf']})).rejects.toThrow();
  });
});
