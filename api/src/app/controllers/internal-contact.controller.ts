import { Controller, Get, UsePipes, UseGuards, Query, Param} from '@nestjs/common';
import { ApiTags, ApiBasicAuth } from '@nestjs/swagger';

import { JoiValidationPipe } from '../pipes';

import {
  IdSchema,
  InternalContactQueryDTO, ConfirmContactQuerySchema,
} from '../dto';

import { InternalContactService } from '../services';

import { AuthGuard } from '@nestjs/passport';

import { ConfirmSetContact } from '../entities';
import { IPGuard } from '../guards';
import { IPs } from '../decorators/ips.decorator';


const accessableIPs = process.env.CONTACTS_ACCESSABLE_IPS ?
  JSON.parse(process.env.CONTACTS_ACCESSABLE_IPS): [];
@ApiTags('Internal Contact')
@ApiBasicAuth()
@Controller('')

export class InternalContactController {
  constructor(
    private readonly confirmContactService: InternalContactService,
  ) { }

  @Get()
  @UsePipes(new JoiValidationPipe({
    query: ConfirmContactQuerySchema,
  }))
  @UseGuards(AuthGuard('basic-external'), IPGuard)
  @IPs(...accessableIPs)
  async query(
    @Query() filters: InternalContactQueryDTO,
  ): Promise<ConfirmSetContact[]> {
    return await this.confirmContactService.filter(filters);
  }

  @Get('multi-system')
  @UseGuards(AuthGuard('basic-external'), IPGuard)
  @IPs(...accessableIPs)
  async getCompination(
  ): Promise<ConfirmSetContact[]> {
    return await this.confirmContactService.getCompined();
  }

  @Get(':id')
  @UsePipes(new JoiValidationPipe({
    param: { id: IdSchema }
  }))
  @UseGuards(AuthGuard('basic-external'), IPGuard)
  @IPs(...accessableIPs)
  async findById(
    @Param('id') id: string,
  ): Promise<ConfirmSetContact> {
    return await this.confirmContactService.getById(id);
  }

};
