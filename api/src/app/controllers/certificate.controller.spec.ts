import { Test } from '@nestjs/testing';
import { PassportModule } from '@nestjs/passport';
import { CertificateController } from '.';
import { CertificateService, RoleService } from '../services';

const mockService = () => ({
  addCertificate: jest.fn(),
  getCertificate: jest.fn(),
  removeCertificate: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  filter: jest.fn(),
  getById: jest.fn(),
  delete: jest.fn(),
  softDelete: jest.fn(),
});


describe('Certificates Controller', () => {
  let controller;
  let service;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      controllers: [CertificateController],
      providers: [
        { provide: RoleService, useFactory: mockService },

        { provide: CertificateService, useFactory: mockService },
      ],
    }).compile();

    controller = module.get<CertificateController>(CertificateController);
    service = module.get<CertificateService>(CertificateService);
  });
  it('Upload Certificate', async () => {
    const expectedResult = 'result';
    jest.spyOn(service, 'addCertificate').mockResolvedValue(expectedResult);
    expect(await controller.create('[File]')).toBe('result');
  });
  it('get Certificate', async () => {
    const expectedResult = 'result';
    jest.spyOn(service, 'getCertificate').mockResolvedValue(expectedResult);
    expect(await controller.get('[File]', 'id', {setHeader: () => (null) , send : (text) => text})).toBe('result');
  });
  it('remove Certificate', async () => {
    const expectedResult = 'result';
    jest.spyOn(service, 'removeCertificate').mockResolvedValue(expectedResult);
    expect(await controller.delete('[File]', 'id', {setHeader: () => (null) , send : (text) => text})).toBe('result');
  });
});
