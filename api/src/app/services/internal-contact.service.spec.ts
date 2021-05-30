import { HttpModule, HttpService } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { InternalContactService } from '.';
import {  InternalContactQueryDTO } from '../dto';
import { Company, ConfirmSet, ConfirmSetContact, Segment } from '../entities';
import { mockRepository } from '../helpers';

describe('InternalContact Service', () => {
  let service;
  const mockService = () => ({
    get: jest.fn(),
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports:[HttpModule],
      providers: [
        InternalContactService,
        { provide: HttpService, useFactory: mockService },

        {
          provide: getRepositoryToken(ConfirmSetContact),
          useValue: new mockRepository(ConfirmSetContact),
        },
        {
          provide: getRepositoryToken(ConfirmSetContact),
          useValue: new mockRepository(ConfirmSetContact),
        },
        {
          provide: getRepositoryToken(Company),
          useValue: new mockRepository(Company),
        },
        {
          provide: getRepositoryToken(Segment),
          useValue: new mockRepository(Segment),
        },
        {
          provide: getRepositoryToken(ConfirmSet),
          useValue: new mockRepository(ConfirmSet),
        },
       ],
    }).compile();
    service = module.get<InternalContactService>(InternalContactService);
  });
  it('find Internal SetContact By Id', async () => {
    const id = '983cd7b8-4715-4087-8a96-252a4323ba58';
    const expectedValue = {
      emailAddress: undefined, name: undefined, phoneNumber: undefined,
      organization: { businessId: undefined, isForeign: false, name: undefined },
      roles: ["TR Palveluntuottaja" ]};
    expect(await service.getById(id)).toEqual(expectedValue);
  });

  it('filter internal contacts', async () => {
    const body: InternalContactQueryDTO = {};
    const result = await service.filter(body);
    expect(result).toEqual(new Array(30).fill({
      emailAddress: undefined, name: undefined, phoneNumber: undefined,
      organization: { businessId: undefined, isForeign: false, name: undefined },
      roles: ["TR Palveluntuottaja" ]}));

  });

});
