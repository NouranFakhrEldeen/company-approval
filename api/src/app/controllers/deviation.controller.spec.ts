import { Test } from '@nestjs/testing';
import { PassportModule } from '@nestjs/passport';
import { DeviationController } from '.';
import { DeviationService, RoleService } from '../services';
import { Deviation } from '../entities';
const mockService = () => ({
  create: jest.fn(),
  update: jest.fn(),
  filter: jest.fn(),
  getById: jest.fn(),
  delete: jest.fn(),
  softDelete: jest.fn(),
});

describe('Confirm Contact Controller', () => {
  let controller;
  let service;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      controllers: [DeviationController],
      providers: [
        { provide: RoleService, useFactory: mockService },
        { provide: DeviationService, useFactory: mockService },
      ],
    }).compile();

    controller = module.get<DeviationController>(DeviationController);
    service = module.get<DeviationService>(DeviationService);
  });
  it('filter deviations', async () => {
    const expectedResult = [new Deviation()];
    jest.spyOn(service, 'filter').mockResolvedValue(expectedResult);
    expect(await controller.query('query')).toBe(expectedResult);
  });
  it('find deviation By Id', async () => {
    const expectedResult = new Deviation();
    jest.spyOn(service, 'getById').mockResolvedValue(expectedResult);
    expect(await controller.findById('the id')).toBe(expectedResult);
  });
});
