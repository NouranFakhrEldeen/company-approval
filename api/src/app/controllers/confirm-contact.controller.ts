import { Controller, Get, UsePipes, UseGuards, Query, Param, Body, Post, Patch, Delete } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

import { JoiValidationPipe } from '../pipes';

import {
  IdSchema,
  ConfirmContactCreateDTO, ConfirmContactCreateSchema,
  ConfirmContactQueryDTO, ConfirmContactQuerySchema,
  ConfirmContactUpdateDTO, ConfirmContactUpdateSchema, IdGeneralSchema,
} from '../dto';

import {  ConfirmContactService } from '../services';

import { ScopesGuard } from '../guards';
import { AuthGuard } from '@nestjs/passport';

import { Scopes, User } from '../decorators';
import { ConfirmSetContact } from '../entities';

@ApiTags('Confirm Contact')
@ApiBearerAuth()
@Controller('')

export class ConfirmContactController {
  constructor(
    private readonly confirmContactService: ConfirmContactService,
  ) { }

  @Post()
  @UsePipes(new JoiValidationPipe({
    param: {
      confirmSetId: IdSchema,
    },
    body: ConfirmContactCreateSchema,
  }))
  @UseGuards(AuthGuard(), ScopesGuard)
  @Scopes('confirm-contact:create')
  async add(
    @Body() ConfirmSetContact: ConfirmContactCreateDTO,
    @Param('confirmSetId') confirmSetId: string,
    @User() user: any,
  ): Promise<ConfirmSetContact> {
    return await this.confirmContactService.create(ConfirmSetContact, confirmSetId, user);
  }

  @Patch(':id')
  @UsePipes(new JoiValidationPipe({
    param: {
      confirmSetId: IdSchema,
      id: IdSchema,
    },
    body: ConfirmContactUpdateSchema,
  }))
  @UseGuards(AuthGuard(), ScopesGuard)
  @Scopes('confirm-contact:update')
  async update(
    @Body() ConfirmSetContact: ConfirmContactUpdateDTO,
    @Param('confirmSetId') confirmSetId: string,
    @Param('id') id: string,
    @User() user: any,
  ): Promise<ConfirmSetContact> {
    return await this.confirmContactService.update(id, confirmSetId, ConfirmSetContact, user);
  }

  @Get()
  @UsePipes(new JoiValidationPipe({
    param: {
      confirmSetId: IdGeneralSchema,
    },
    query: ConfirmContactQuerySchema,
  }))
  @UseGuards(AuthGuard(), ScopesGuard)
  @Scopes('confirm-contact:read')
  async query(
    @Param('confirmSetId') confirmSetId: string,
    @Query() filters: ConfirmContactQueryDTO,
    @User() user: any,
  ): Promise<{ pagination: any, records: ConfirmSetContact[] }> {
    return await this.confirmContactService.filter(filters, confirmSetId, user);
  }

  @Get(':id')
  @UsePipes(new JoiValidationPipe({
    param: {
      confirmSetId: IdSchema,
      id: IdSchema,
    },
  }))
  @UseGuards(AuthGuard(), ScopesGuard)
  @Scopes('confirm-contact:read')
  async findById(
    @Param('id') id: string,
    @Param('confirmSetId') confirmSetId: string,
    @User() user: any,
  ): Promise<ConfirmSetContact> {
    return await this.confirmContactService.getById(id, confirmSetId, user);
  }

  @Delete(':id')
  @UsePipes(new JoiValidationPipe({
    param: {
      confirmSetId: IdSchema,
      id: IdSchema,
    },
  }))
  @UseGuards(AuthGuard(), ScopesGuard)
  @Scopes('confirm-contact:delete')
  async removeById(
    @Param('id') id: string,
    @Param('confirmSetId') confirmSetId: string,
    @User() user: any,
  ): Promise<{ message: string }> {
    return await this.confirmContactService.softDelete(id, confirmSetId, user);
  }

};
