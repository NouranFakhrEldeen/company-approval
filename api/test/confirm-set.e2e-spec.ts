import { HttpModule, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfirmSet, Role, Company, Segment, ConfirmSetSegmentItem, ConfirmSetSegment, Certificate, Metadata, SegmentItem, Deviation } from '../src/app/entities';
import * as request from 'supertest';
import { ConfirmSetController } from '../src/app/controllers';
import { ConfirmSetService, RoleService, CompanyService, ConfirmSegmentItemService, ConfirmSegmentService, CertificateService, InternalSyncService, SegmentService, SegmentItemService, SmtpServers } from '../src/app/services';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './auth/jwt.strategy';
import { generateToken } from './auth/token-generator';
import { mockRepository } from '../src/app/helpers';
import { NodeMailerService } from '../src/app/smtp-servers/nodemailer.service';

describe('ConfirmSet (e2e)', () => {
  let app: INestApplication;
  let roleService;
  let token: string;
  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' }), HttpModule],
      controllers: [ConfirmSetController],
      providers: [
        ConfirmSetService,
        ConfirmSegmentService,
        ConfirmSegmentItemService,
        CompanyService,
        CertificateService,
        InternalSyncService,
        RoleService,
        JwtStrategy,
        SegmentService,
        SegmentItemService,
        SmtpServers,
        NodeMailerService,
        {
          provide: getRepositoryToken(Deviation),
          useValue: new mockRepository(Deviation),
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
          provide: getRepositoryToken(Certificate),
          useValue: new mockRepository(Certificate),
        },
        {
          provide: getRepositoryToken(Metadata),
          useValue: new mockRepository(Metadata),
        },
        {
          provide: getRepositoryToken(ConfirmSet),
          useValue: new mockRepository(ConfirmSet),
        },
        {
          provide: getRepositoryToken(Company),
          useValue: new mockRepository(Company),
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
          provide: getRepositoryToken(Role),
          useValue: new mockRepository(Role),
        },
      ],
    }).compile();
    token = generateToken().token;
    app = moduleFixture.createNestApplication();
    roleService = moduleFixture.get<RoleService>(RoleService);
    await app.init();
  });
  describe('/confirm-set (GET)', () => {
    it('correct request', () => {
      jest.spyOn(roleService, 'getByName').mockResolvedValue({ name: 'role', scopes: ['*:*'] });
      return request(app.getHttpServer())
        .get('/')
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
        .expect('{"records":[{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}],"pagination":{"statusCount":{},"count":20,"itemsPerPage":20,"totalPages":2,"currentPage":1,"total":30}}');
    });
    it('wrong token', () => {
      jest.spyOn(roleService, 'getByName').mockResolvedValue({ name: 'role', scopes: ['wrong:scope'] });
      return request(app.getHttpServer())
        .get('/')
        .set('Authorization', 'Bearer ' + 'wrong token')
        .expect(401);
    });
    it('have no access', () => {
      jest.spyOn(roleService, 'getByName').mockResolvedValue({ name: 'role', scopes: ['wrong:scope'] });
      return request(app.getHttpServer())
        .get('/')
        .set('Authorization', 'Bearer ' + token)
        .expect(403);
    });
  })

  describe('/confirm-set/${id} (GET)', () => {
    it('correct request', () => {
      jest.spyOn(roleService, 'getByName').mockResolvedValue({ name: 'role', scopes: ['*:*'] });
      return request(app.getHttpServer())
        .get('/FEAA2F05-045F-EB11-8C90-54BF64198DFB')
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
        .expect('{}');
    });
    it('wrong token', () => {
      jest.spyOn(roleService, 'getByName').mockResolvedValue({ name: 'role', scopes: ['wrong:scope'] });
      return request(app.getHttpServer())
        .get('/FEAA2F05-045F-EB11-8C90-54BF64198DFB')
        .set('Authorization', 'Bearer ' + 'wrong token')
        .expect(401);
    });
    it('have no access', () => {
      jest.spyOn(roleService, 'getByName').mockResolvedValue({ name: 'role', scopes: ['wrong:scope'] });
      return request(app.getHttpServer())
        .get('/FEAA2F05-045F-EB11-8C90-54BF64198DFB')
        .set('Authorization', 'Bearer ' + token)
        .expect(403);
    });
  })

  describe('/confirm-set (POST)', () => {
    it('correct request', () => {
      jest.spyOn(roleService, 'getByName').mockResolvedValue({ name: 'role', scopes: ['*:*'] });
      return request(app.getHttpServer())
        .post('/')
        .send({
          "companyId": "FEAA2F05-045F-EB11-8C90-54BF64198DFB",
          "startTime": "2020-01-01",
          "contacts": [],
          "segments": []
        })
        .set('Authorization', 'Bearer ' + token)
        // .expect(201)
        .expect('{}');
    });
    it('wrong DTO', () => {
      jest.spyOn(roleService, 'getByName').mockResolvedValue({ name: 'role', scopes: ['*:*'] });
      return request(app.getHttpServer())
        .post('/')
        .send({})
        .set('Authorization', 'Bearer ' + token)
        .expect(400)
    });
    it('wrong token', () => {
      jest.spyOn(roleService, 'getByName').mockResolvedValue({ name: 'role', scopes: ['wrong:scope'] });
      return request(app.getHttpServer())
        .post('/')
        .send({
          "companyId": "FEAA2F05-045F-EB11-8C90-54BF64198DFB",
          "startTime": "2020-01-01",
          "contacts": [],
          "segments": []
        })
        .set('Authorization', 'Bearer ' + 'wrong token')
        .expect(401);
    });
    it('have no access', () => {
      jest.spyOn(roleService, 'getByName').mockResolvedValue({ name: 'role', scopes: ['wrong:scope'] });
      return request(app.getHttpServer())
        .post('/')
        .send({
          "companyId": "FEAA2F05-045F-EB11-8C90-54BF64198DFB",
          "startTime": "2020-01-01",
          "contacts": [],
          "segments": []
        })
        .set('Authorization', 'Bearer ' + token)
        .expect(403);
    });
  });

  describe('/confirm-set/${id} (PATCH)', () => {
    it('correct request', () => {
      jest.spyOn(roleService, 'getByName').mockResolvedValue({ name: 'role', scopes: ['*:*'] });
      return request(app.getHttpServer())
        .patch('/FEAA2F05-045F-EB11-8C90-54BF64198DFB')
        .send({
          "startTime": "2020-01-01",
        })
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
        .expect('{}');
    });
    it('wrong DTO', () => {
      jest.spyOn(roleService, 'getByName').mockResolvedValue({ name: 'role', scopes: ['*:*'] });
      return request(app.getHttpServer())
        .patch('/FEAA2F05-045F-EB11-8C90-54BF64198DFB')
        .send({ name: 123 })
        .set('Authorization', 'Bearer ' + token)
        .expect(400)
    });
    it('wrong token', () => {
      jest.spyOn(roleService, 'getByName').mockResolvedValue({ name: 'role', scopes: ['wrong:scope'] });
      return request(app.getHttpServer())
        .patch('/FEAA2F05-045F-EB11-8C90-54BF64198DFB')
        .send({
          "startTime": "2020-01-01",
        })
        .set('Authorization', 'Bearer ' + 'wrong token')
        .expect(401);
    });
    it('have no access', () => {
      jest.spyOn(roleService, 'getByName').mockResolvedValue({ name: 'role', scopes: ['wrong:scope'] });
      return request(app.getHttpServer())
        .patch('/FEAA2F05-045F-EB11-8C90-54BF64198DFB')
        .send({
          "startTime": "2020-01-01",
        })
        .set('Authorization', 'Bearer ' + token)
        .expect(403);
    });
  });
});