import { Controller, UseGuards, Body, Get, Patch} from '@nestjs/common';
import { ApiTags, ApiBasicAuth } from '@nestjs/swagger';
import { InternalSyncService } from '../services';
import { AuthGuard } from '@nestjs/passport';
import { IPGuard } from '../guards';
import { Segment } from '../entities';

@ApiTags('Internal sync')
@ApiBasicAuth()
@Controller('')

export class InternalSyncController {
  constructor(
    private readonly internalSyncService: InternalSyncService,
  ) { }

  @Get('sync-segments')
  @UseGuards(AuthGuard('basic-internal'), IPGuard)
  async syncSegments(): Promise<{message: string, success: boolean, segments?: Segment[]}> {
    return await this.internalSyncService.syncSegments();
  }
  @Patch('return-audit')
  @UseGuards(AuthGuard('basic-internal'), IPGuard)
  async returnAudit(@Body() data: any): Promise<{message: string, success: boolean, segment?: Segment}> {
    return await this.internalSyncService.returnAudit(data);
  }
  

};
