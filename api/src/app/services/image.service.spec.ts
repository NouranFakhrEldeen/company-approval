import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { ImageService } from '.';
import { Image } from '../entities';
import { mockRepository } from '../helpers';
import { HttpModule } from '@nestjs/common';

describe('Image Service', () => {
  let service;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports:[
        HttpModule,
      ],
      providers: [
        ImageService,
        {
          provide: getRepositoryToken(Image),
          useValue: new mockRepository(Image),
        },
       ],
    }).compile();
    service = module.get<ImageService>(ImageService);    
  });
  it('add a valid file (local)', async () => {
    const file = {
        mimetype: 'image/jpg',
        originalname: 'test.jpg',
    };
    service.getConfirmSet = async () => ({records: [{}]});
    expect(!!(await service.addImage({file, type: 'local', user:{}, mimes: ['image/jpg']}))).toEqual(true);
  });

  it('add not valid file (local)', async () => {
    const file = {
        mimetype: 'application/pdf',
        originalname: 'test.png',
    };
    expect(service.addImage({file, type: 'local', user:{}, mimes: ['image/jpg']})).rejects.toThrow();
  });
});
