import { Controller, Get, UsePipes, UseGuards, Query, Param, Body, Post, Patch, Delete } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

import { JoiValidationPipe } from '../pipes';

import {
  IdSchema,
  DeviationQueryDTO, DeviationQuerySchema,
  DeviationFixDTO, DeviationFixSchema,
  DeviationReviewDTO, DeviationReviewSchema, IdGeneralSchema,
} from '../dto';

import {  DeviationService } from '../services';

import { ScopesGuard } from '../guards';
import { AuthGuard } from '@nestjs/passport';

import { Scopes, User } from '../decorators';
import { Deviation } from '../entities';

@ApiTags('Deviations')
@ApiBearerAuth()
@Controller('')

export class DeviationController {
  constructor(
    private readonly deviationService: DeviationService,
  ) { }

  @Patch(':id/fix')
  @UsePipes(new JoiValidationPipe({
    param: {
      confirmSetId: IdSchema,
      id: IdSchema,
    },
    body: DeviationFixSchema,
  }))
  @UseGuards(AuthGuard(), ScopesGuard)
  @Scopes('deviation:fix')
  async fix(
    @Body() deviation: DeviationFixDTO,
    @Param('confirmSetId') confirmSetId: string,
    @Param('id') id: string,
    @User() requestMaker: any,
  ): Promise<Deviation> {
    return await this.deviationService.fix({id, requestMaker, deviation, confirmSetId});
  }

  @Patch(':id/review')
  @UsePipes(new JoiValidationPipe({
    param: {
      confirmSetId: IdSchema,
      id: IdSchema,
    },
    body: DeviationReviewSchema,
  }))
  @UseGuards(AuthGuard(), ScopesGuard)
  @Scopes('deviation:review')
  async review(
    @Body() deviation: DeviationReviewDTO,
    @Param('confirmSetId') confirmSetId: string,
    @Param('id') id: string,
    @User() requestMaker: any,
  ): Promise<Deviation> {
    return await this.deviationService.review({id, requestMaker, deviation, confirmSetId});
  }

  @Get()
  @UsePipes(new JoiValidationPipe({
    param: {
      confirmSetId: IdGeneralSchema,
    },
    query: DeviationQuerySchema,
  }))
  @UseGuards(AuthGuard(), ScopesGuard)
  @Scopes('deviation:read')
  async query(
    @Param('confirmSetId') confirmSetId: string,
    @Query() filters: DeviationQueryDTO,
    @User() user: any,
  ): Promise<{ pagination: any, records: Deviation[] }> {
    return await this.deviationService.filter(filters, confirmSetId, user);
  }

  @Get(':id')
  @UsePipes(new JoiValidationPipe({
    param: {
      confirmSetId: IdSchema,
      id: IdSchema,
    },
  }))
  @UseGuards(AuthGuard(), ScopesGuard)
  @Scopes('deviation:read')
  async findById(
    @Param('id') id: string,
    @Param('confirmSetId') confirmSetId: string,
    @User() user: any,
  ): Promise<Deviation> {
    return await this.deviationService.getById(id, confirmSetId, user);
  }

};
