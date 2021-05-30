import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Segment, Role, SegmentItem } from '../src/app/entities';
import * as request from 'supertest';
import { SegmentController } from '../src/app/controllers';
import { SegmentService, RoleService, SegmentItemService } from '../src/app/services';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './auth/jwt.strategy';
import { generateToken } from './auth/token-generator';
import { mockRepository } from '../src/app/helpers';

describe('Segment (e2e)', () => {
  let app: INestApplication;
  let roleService;
  let token: string;
  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      controllers: [SegmentController],
      providers: [
        SegmentService,
        SegmentItemService,
        RoleService,
        JwtStrategy,
        {
          provide: getRepositoryToken(Segment),
          useValue: new mockRepository(Segment),
        },
        {
          provide: getRepositoryToken(SegmentItem),
          useValue: new mockRepository(SegmentItem),
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
  describe('/segment (GET)', () => {
    it('correct request', () => {
      jest.spyOn(roleService, 'getByName').mockResolvedValue({ name: 'role', scopes: ['*:*'] });
      return request(app.getHttpServer())
        .get('/')
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
        .expect('{"records":[{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}],"pagination":{"count":20,"itemsPerPage":20,"totalPages":2,"currentPage":1,"total":30}}');
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

  describe('/segment/${id} (GET)', () => {
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

  describe('/segment (POST)', () => {
    it('correct request', () => {
      jest.spyOn(roleService, 'getByName').mockResolvedValue({ name: 'role', scopes: ['*:*'] });
      return request(app.getHttpServer())
        .post('/')
        .send({
          "checklistId": "601bf23770098e3a0844f356",
          "name": "string1",
          "enabled": true,
          "type": "NORMAL",
          "index": 1,
          "items": [{ "number": '1', "name": "string" }],
        })
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
        .send({
          "checklistId": "string1",
          "name": "string1",
          "enabled": true,
          "type": "NORMAL",
          "items": [{ "number": '1', "name": "string" }],
        })
        .set('Authorization', 'Bearer ' + 'wrong token')
        .expect(401);
    });
    it('have no access', () => {
      jest.spyOn(roleService, 'getByName').mockResolvedValue({ name: 'role', scopes: ['wrong:scope'] });
      return request(app.getHttpServer())
        .post('/')
        .send({
          "checklistId": "string1",
          "name": "string1",
          "enabled": true,
          "type": "NORMAL",
          "items": [{ "number": '1', "name": "string" }],
        })
        .set('Authorization', 'Bearer ' + token)
        .expect(403);
    });
  });

  describe('/segment/${id} (PATCH)', () => {
    it('correct request', () => {
      jest.spyOn(roleService, 'getByName').mockResolvedValue({ name: 'role', scopes: ['*:*'] });
      return request(app.getHttpServer())
        .patch('/FEAA2F05-045F-EB11-8C90-54BF64198DFB')
        .send({
          "name": "string1",
          "enabled": true,
          "type": "NORMAL",
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
          "name": "string1",
          "enabled": true,
          "type": "NORMAL",
        })
        .set('Authorization', 'Bearer ' + 'wrong token')
        .expect(401);
    });
    it('have no access', () => {
      jest.spyOn(roleService, 'getByName').mockResolvedValue({ name: 'role', scopes: ['wrong:scope'] });
      return request(app.getHttpServer())
        .patch('/FEAA2F05-045F-EB11-8C90-54BF64198DFB')
        .send({
          "name": "string1",
          "enabled": true,
          "type": "NORMAL",
        })
        .set('Authorization', 'Bearer ' + token)
        .expect(403);
    });
  });

  describe('/segment/${segmentId}/item (GET)', () => {
    it('correct request', () => {
      jest.spyOn(roleService, 'getByName').mockResolvedValue({ name: 'role', scopes: ['*:*'] });
      return request(app.getHttpServer())
        .get('/FEAA2F05-045F-EB11-8C90-54BF64198DFB/item')
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
        .expect('{"records":[{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}],"pagination":{"count":20,"itemsPerPage":20,"totalPages":2,"currentPage":1,"total":30}}');
    });
    it('wrong token', () => {
      jest.spyOn(roleService, 'getByName').mockResolvedValue({ name: 'role', scopes: ['wrong:scope'] });
      return request(app.getHttpServer())
        .get('/FEAA2F05-045F-EB11-8C90-54BF64198DFB/item')
        .set('Authorization', 'Bearer ' + 'wrong token')
        .expect(401);
    });
    it('have no access', () => {
      jest.spyOn(roleService, 'getByName').mockResolvedValue({ name: 'role', scopes: ['wrong:scope'] });
      return request(app.getHttpServer())
        .get('/FEAA2F05-045F-EB11-8C90-54BF64198DFB/item')
        .set('Authorization', 'Bearer ' + token)
        .expect(403);
    });
  })

  describe('/segment/${segmentId}/item/${id} (GET)', () => {
    it('correct request', () => {
      jest.spyOn(roleService, 'getByName').mockResolvedValue({ name: 'role', scopes: ['*:*'] });
      return request(app.getHttpServer())
        .get('/FEAA2F05-045F-EB11-8C90-54BF64198DFB/item/FEAA2F05-045F-EB11-8C90-54BF64198DFB')
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
        .expect('{}');
    });
    it('wrong token', () => {
      jest.spyOn(roleService, 'getByName').mockResolvedValue({ name: 'role', scopes: ['wrong:scope'] });
      return request(app.getHttpServer())
        .get('/FEAA2F05-045F-EB11-8C90-54BF64198DFB/item/FEAA2F05-045F-EB11-8C90-54BF64198DFB')
        .set('Authorization', 'Bearer ' + 'wrong token')
        .expect(401);
    });
    it('have no access', () => {
      jest.spyOn(roleService, 'getByName').mockResolvedValue({ name: 'role', scopes: ['wrong:scope'] });
      return request(app.getHttpServer())
        .get('/FEAA2F05-045F-EB11-8C90-54BF64198DFB/item/FEAA2F05-045F-EB11-8C90-54BF64198DFB')
        .set('Authorization', 'Bearer ' + token)
        .expect(403);
    });
  })

  describe('/segment/${segmentId}/item (POST)', () => {
    it('correct request', () => {
      jest.spyOn(roleService, 'getByName').mockResolvedValue({ name: 'role', scopes: ['*:*'] });
      return request(app.getHttpServer())
        .post('/FEAA2F05-045F-EB11-8C90-54BF64198DFB/item')
        .send({ "number": '1', "name": "string" })
        .set('Authorization', 'Bearer ' + token)
        .expect(201)
        .expect('{}');
    });
    it('wrong DTO', () => {
      jest.spyOn(roleService, 'getByName').mockResolvedValue({ name: 'role', scopes: ['*:*'] });
      return request(app.getHttpServer())
        .post('/FEAA2F05-045F-EB11-8C90-54BF64198DFB/item')
        .send({})
        .set('Authorization', 'Bearer ' + token)
        .expect(400)
    });
    it('wrong token', () => {
      jest.spyOn(roleService, 'getByName').mockResolvedValue({ name: 'role', scopes: ['wrong:scope'] });
      return request(app.getHttpServer())
        .post('/FEAA2F05-045F-EB11-8C90-54BF64198DFB/item')
        .send({ "number": '1', "name": "string" })
        .set('Authorization', 'Bearer ' + 'wrong token')
        .expect(401);
    });
    it('have no access', () => {
      jest.spyOn(roleService, 'getByName').mockResolvedValue({ name: 'role', scopes: ['wrong:scope'] });
      return request(app.getHttpServer())
        .post('/FEAA2F05-045F-EB11-8C90-54BF64198DFB/item')
        .send({ "number": '1', "name": "string" })
        .set('Authorization', 'Bearer ' + token)
        .expect(403);
    });
  });

  describe('/segment/${segmentId}/item/${id} (PATCH)', () => {
    it('correct request', () => {
      jest.spyOn(roleService, 'getByName').mockResolvedValue({ name: 'role', scopes: ['*:*'] });
      return request(app.getHttpServer())
        .patch('/FEAA2F05-045F-EB11-8C90-54BF64198DFB/item/FEAA2F05-045F-EB11-8C90-54BF64198DFB')
        .send({ "number": '1', "name": "string" })
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
        .expect('{}');
    });
    it('wrong DTO', () => {
      jest.spyOn(roleService, 'getByName').mockResolvedValue({ name: 'role', scopes: ['*:*'] });
      return request(app.getHttpServer())
        .patch('/FEAA2F05-045F-EB11-8C90-54BF64198DFB/item/FEAA2F05-045F-EB11-8C90-54BF64198DFB')
        .send({ name: 123 })
        .set('Authorization', 'Bearer ' + token)
        .expect(400)
    });
    it('wrong token', () => {
      jest.spyOn(roleService, 'getByName').mockResolvedValue({ name: 'role', scopes: ['wrong:scope'] });
      return request(app.getHttpServer())
        .patch('/FEAA2F05-045F-EB11-8C90-54BF64198DFB/item/FEAA2F05-045F-EB11-8C90-54BF64198DFB')
        .send({ "number": '1', "name": "string" })
        .set('Authorization', 'Bearer ' + 'wrong token')
        .expect(401);
    });
    it('have no access', () => {
      jest.spyOn(roleService, 'getByName').mockResolvedValue({ name: 'role', scopes: ['wrong:scope'] });
      return request(app.getHttpServer())
        .patch('/FEAA2F05-045F-EB11-8C90-54BF64198DFB/item/FEAA2F05-045F-EB11-8C90-54BF64198DFB')
        .send({ "number": '1', "name": "string" })
        .set('Authorization', 'Bearer ' + token)
        .expect(403);
    });
  });
});