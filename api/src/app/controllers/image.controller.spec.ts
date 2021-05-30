import { Test } from '@nestjs/testing';
import { PassportModule } from '@nestjs/passport';
import { ImageController } from '.';
import { ImageService, RoleService } from '../services';

const mockService = () => ({
  addImage: jest.fn(),
  getImage: jest.fn(),
  removeImage: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  filter: jest.fn(),
  getById: jest.fn(),
  delete: jest.fn(),
  softDelete: jest.fn(),
});


describe('Images Controller', () => {
  let controller;
  let service;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      controllers: [ImageController],
      providers: [
        { provide: RoleService, useFactory: mockService },

        { provide: ImageService, useFactory: mockService },
      ],
    }).compile();

    controller = module.get<ImageController>(ImageController);
    service = module.get<ImageService>(ImageService);
  });
  it('Upload Image', async () => {
    const expectedResult = 'result';
    jest.spyOn(service, 'addImage').mockResolvedValue(expectedResult);
    expect(await controller.create('[File]')).toBe('result');
  });
  it('get Image', async () => {
    const expectedResult = 'result';
    jest.spyOn(service, 'getImage').mockResolvedValue(expectedResult);
    expect(await controller.get('[File]', 'id', {setHeader: () => (null) , send : (text) => text})).toBe('result');
  });
  it('remove Image', async () => {
    const expectedResult = 'result';
    jest.spyOn(service, 'removeImage').mockResolvedValue(expectedResult);
    expect(await controller.delete('[File]', 'id', {setHeader: () => (null) , send : (text) => text})).toBe('result');
  });
});
