import { Test } from '@nestjs/testing';
import { PassportModule } from '@nestjs/passport';
import { InternalContactController } from '.';
import { InternalContactService } from '../services';
import { ConfirmSet } from '../entities';
import { HttpModule } from '@nestjs/common';
const mockService = () => ({
  filter: jest.fn(),
  getById: jest.fn(),
});

describe('Confirm Contact Controller', () => {
  let controller;
  let service;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'basic-external' }), HttpModule],
      controllers: [InternalContactController],
      providers: [
        { provide: InternalContactService, useFactory: mockService },
      ],
    }).compile();

    controller = module.get<InternalContactController>(InternalContactController);
    service = module.get<InternalContactService>(InternalContactService);
  });
  it('filter confirm sets', async () => {
    const expectedResult = [new ConfirmSet()];
    jest.spyOn(service, 'filter').mockResolvedValue(expectedResult);
    expect(await controller.query('query')).toBe(expectedResult);
  });
  it('find confirm contact By Id', async () => {
    const expectedResult = new ConfirmSet();
    jest.spyOn(service, 'getById').mockResolvedValue(expectedResult);
    expect(await controller.findById('the id')).toBe(expectedResult);
  });
});
