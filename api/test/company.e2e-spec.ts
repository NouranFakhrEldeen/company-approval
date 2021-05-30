import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Company, Deviation, Role } from '../src/app/entities';
import * as request from 'supertest';
import { CompanyController } from '../src/app/controllers';
import { CompanyService, RoleService } from '../src/app/services';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './auth/jwt.strategy';
import { generateToken } from './auth/token-generator';
import { mockRepository } from '../src/app/helpers';

describe('Company (e2e)', () => {
  let app: INestApplication;
  let roleService;
  let token: string;
  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      controllers: [CompanyController],
      providers: [
        CompanyService,
        RoleService,
        JwtStrategy,
        {
          provide: getRepositoryToken(Deviation),
          useValue: new mockRepository(Deviation),
        },
        {
          provide: getRepositoryToken(Company),
          useValue: new mockRepository(Company),
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
  describe('/company (GET)', () => {
    it('correct request', () => {
      jest.spyOn(roleService, 'getByName').mockResolvedValue({ name: 'role', scopes: ['*:*'] });
      return request(app.getHttpServer())
        .get('/')
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
        .expect('{"records":[{"securityContractValid":false},{"securityContractValid":false},{"securityContractValid":false},{"securityContractValid":false},{"securityContractValid":false},{"securityContractValid":false},{"securityContractValid":false},{"securityContractValid":false},{"securityContractValid":false},{"securityContractValid":false},{"securityContractValid":false},{"securityContractValid":false},{"securityContractValid":false},{"securityContractValid":false},{"securityContractValid":false},{"securityContractValid":false},{"securityContractValid":false},{"securityContractValid":false},{"securityContractValid":false},{"securityContractValid":false}],"pagination":{"count":20,"itemsPerPage":20,"totalPages":2,"currentPage":1,"total":30}}');
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

  describe('/company/${id} (GET)', () => {
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

  describe('/company (POST)', () => {
    it('correct request', () => {
      jest.spyOn(roleService, 'getByName').mockResolvedValue({ name: 'role', scopes: ['*:*'] });
      return request(app.getHttpServer())
        .post('/')
        .send({ name: 'test', businessId: 'test' })
        .set('Authorization', 'Bearer ' + token)
        .expect(201)
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
        .send({ name: 'test', businessId: 'test' })
        .set('Authorization', 'Bearer ' + 'wrong token')
        .expect(401);
    });
    it('have no access', () => {
      jest.spyOn(roleService, 'getByName').mockResolvedValue({ name: 'role', scopes: ['wrong:scope'] });
      return request(app.getHttpServer())
        .post('/')
        .send({ name: 'test', businessId: 'test' })
        .set('Authorization', 'Bearer ' + token)
        .expect(403);
    });
  });

  describe('/company/${id} (PATCH)', () => {
    it('correct request', () => {
      jest.spyOn(roleService, 'getByName').mockResolvedValue({ name: 'role', scopes: ['*:*'] });
      return request(app.getHttpServer())
        .patch('/FEAA2F05-045F-EB11-8C90-54BF64198DFB')
        .send({ name: 'test', businessId: 'test' })
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
        .send({ name: 'test', businessId: 'test' })
        .set('Authorization', 'Bearer ' + 'wrong token')
        .expect(401);
    });
    it('have no access', () => {
      jest.spyOn(roleService, 'getByName').mockResolvedValue({ name: 'role', scopes: ['wrong:scope'] });
      return request(app.getHttpServer())
        .patch('/FEAA2F05-045F-EB11-8C90-54BF64198DFB')
        .send({ name: 'test', businessId: 'test' })
        .set('Authorization', 'Bearer ' + token)
        .expect(403);
    });
  });
});