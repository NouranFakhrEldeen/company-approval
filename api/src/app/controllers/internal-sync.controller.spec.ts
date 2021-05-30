import { Test } from '@nestjs/testing';
import { PassportModule } from '@nestjs/passport';
import { InternalSyncController } from '.';
import { InternalSyncService } from '../services';
import { HttpModule } from '@nestjs/common';
const mockService = () => ({
  syncSegments: jest.fn(),
});

describe('Sync data Controller', () => {
  let controller;
  let service;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [HttpModule, PassportModule.register({ defaultStrategy: 'basic-internal' })],
      controllers: [InternalSyncController],
      providers: [
        { provide: InternalSyncService, useFactory: mockService },
      ],
    }).compile();

    controller = module.get<InternalSyncController>(InternalSyncController);
    service = module.get<InternalSyncService>(InternalSyncService);
  });
  it('segments sync', async () => {
    const expectedResult = {message: 'synced successfuly', success: true};
    jest.spyOn(service, 'syncSegments').mockResolvedValue(expectedResult);
    expect(await controller.syncSegments()).toBe(expectedResult);
  });
  
});
