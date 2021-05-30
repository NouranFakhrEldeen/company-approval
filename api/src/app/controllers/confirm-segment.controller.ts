import { Controller, Get, UsePipes, UseGuards, Query, Param, Body, Post, Patch, Delete } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

import { JoiValidationPipe } from '../pipes';

import {
  IdSchema,
  ConfirmSegmentCreateDTO, ConfirmSegmentCreateSchema,
  ConfirmSegmentItemCreateDTO, ConfirmSegmentItemCreateSchema,
  ConfirmSegmentItemQueryDTO, ConfirmSegmentItemQuerySchema,
  ConfirmSegmentItemUpdateDTO, ConfirmSegmentItemUpdateSchema,
  ConfirmSegmentUpdateMetadataDTO, ConfirmSegmentUpdateMetadataSchema,
  ConfirmSegmentQueryDTO, ConfirmSegmentQuerySchema,
  ConfirmSegmentUpdateDTO, ConfirmSegmentUpdateSchema,
  IdGeneralSchema,
  ConfirmSegmentItemAnswerDTO, ConfirmSegmentItemAnswerSchema,
  ConfirmSegmentItemReviewSchema, ConfirmSegmentItemReviewDTO,
} from '../dto';

import { ConfirmSegmentItemService, ConfirmSegmentService } from '../services';

import { ScopesGuard } from '../guards';
import { AuthGuard } from '@nestjs/passport';

import { Scopes, User } from '../decorators';
import { ConfirmSetSegment, ConfirmSetSegmentItem } from '../entities';

@ApiTags('Confirm Segment')
@ApiBearerAuth()
@Controller('')

export class ConfirmSegmentController {
  constructor(
    private readonly confrimSegmentService: ConfirmSegmentService,
    private readonly confrimSegmentItemService: ConfirmSegmentItemService,
  ) { }

  @Post()
  @UsePipes(new JoiValidationPipe({
    param: {
      confirmSetId: IdSchema,
    },
    body: ConfirmSegmentCreateSchema,
  }))
  @UseGuards(AuthGuard(), ScopesGuard)
  @Scopes('confirm-segment:create')
  async add(
    @Body() ConfirmSetSegment: ConfirmSegmentCreateDTO,
    @Param('confirmSetId') confirmSetId: string,
    @User() user: any,
  ): Promise<ConfirmSetSegment> {
    return await this.confrimSegmentService.create(ConfirmSetSegment, confirmSetId, user);
  }

  @Patch(':id')
  @UsePipes(new JoiValidationPipe({
    param: {
      confirmSetId: IdSchema,
      id: IdSchema,
    },
    body: ConfirmSegmentUpdateSchema,
  }))
  @UseGuards(AuthGuard(), ScopesGuard)
  @Scopes('confirm-segment:update')
  async update(
    @Body() ConfirmSetSegment: ConfirmSegmentUpdateDTO,
    @Param('id') id: string,
    @Param('confirmSetId') confirmSetId: string,
    @User() user: any,
  ): Promise<ConfirmSetSegment> {
    return await this.confrimSegmentService.update(id, confirmSetId, ConfirmSetSegment, user);
  }

  @Patch(':id/metadata')
  @UsePipes(new JoiValidationPipe({
    param: {
      confirmSetId: IdSchema,
      id: IdSchema,
    },
    body: ConfirmSegmentUpdateMetadataSchema,
  }))
  @UseGuards(AuthGuard(), ScopesGuard)
  @Scopes('confirm-segment:answer')
  async updateMetadata(
    @Body() ConfirmSetSegment: ConfirmSegmentUpdateMetadataDTO,
    @Param('id') id: string,
    @Param('confirmSetId') confirmSetId: string,
    @User() user: any,
  ): Promise<ConfirmSetSegment> {
    return await this.confrimSegmentService.update(id, confirmSetId, ConfirmSetSegment, user);
  }

  @Get()
  @UsePipes(new JoiValidationPipe({
    param: {
      confirmSetId: IdGeneralSchema,
    },
    query: ConfirmSegmentQuerySchema,
  }))
  @UseGuards(AuthGuard(), ScopesGuard)
  @Scopes('confirm-segment:read')
  async query(
    @Param('confirmSetId') confirmSetId: string,
    @Query() filters: ConfirmSegmentQueryDTO,
    @User() user: any,
  ): Promise<{ pagination: any, records: ConfirmSetSegment[] }> {
    return await this.confrimSegmentService.filter(filters, confirmSetId, user);
  }

  @Get(':id')
  @UsePipes(new JoiValidationPipe({
    param: {
      confirmSetId: IdSchema,
      id: IdSchema,
    },
  }))
  @UseGuards(AuthGuard(), ScopesGuard)
  @Scopes('confirm-segment:read')
  async findById(
    @Param('id') id: string,
    @Param('confirmSetId') confirmSetId: string,
    @User() user: any,
  ): Promise<ConfirmSetSegment> {
    return await this.confrimSegmentService.getById(id, confirmSetId, user);
  }

  @Delete(':id')
  @UsePipes(new JoiValidationPipe({
    param: {
      confirmSetId: IdSchema,
      id: IdSchema,
    },
  }))
  @UseGuards(AuthGuard(), ScopesGuard)
  @Scopes('confirm-segment:delete')
  async removeById(
    @Param('id') id: string,
    @Param('confirmSetId') confirmSetId: string,
    @User() user: any,
  ): Promise<{ message: string }> {
    return await this.confrimSegmentService.softDelete(id, confirmSetId, user);
  }

  @Patch(':id/duplicate')
  @UsePipes(new JoiValidationPipe({
    param: {
      confirmSetId: IdSchema,
      id: IdSchema,
    },
  }))
  @UseGuards(AuthGuard(), ScopesGuard)
  @Scopes('confirm-segment:create')
  async duplicate(
    @Param('id') id: string,
    @Param('confirmSetId') confirmSetId: string,
    @User() user: any,
  ): Promise<ConfirmSetSegment> {
    return await this.confrimSegmentService.duplicate(id, confirmSetId, user);
  }
  
  @Post(':segmentId/item')
  @UsePipes(new JoiValidationPipe({
    param: {
      confirmSetId: IdSchema,
      segmentId: IdSchema,
    },
    body: ConfirmSegmentItemCreateSchema,
  }))
  @UseGuards(AuthGuard(), ScopesGuard)
  @Scopes('confirm-segment:create')
  async addItem(
    @Body() confirmSetSegment: ConfirmSegmentItemCreateDTO,
    @Param('segmentId') segmentId: string,
    @Param('confirmSetId') confirmSetId: string,
    @User() user: any,
  ): Promise<ConfirmSetSegment> {
    return await this.confrimSegmentItemService.create(confirmSetSegment, confirmSetId, segmentId, user);
  }

  @Patch(':segmentId/item/:id')
  @UsePipes(new JoiValidationPipe({
    param: {
      confirmSetId: IdSchema,
      segmentId: IdSchema,
      id: IdSchema,
    },
    body: ConfirmSegmentItemUpdateSchema,
  }))
  @UseGuards(AuthGuard(), ScopesGuard)
  @Scopes('confirm-segment:update')
  async updateItem(
    @Body() ConfirmSetSegment: ConfirmSegmentItemUpdateDTO,
    @Param('id') id: string,
    @Param('segmentId') segmentId: string,
    @Param('confirmSetId') confirmSetId: string,
    @User() user: any,
  ): Promise<ConfirmSetSegmentItem> {
    return await this.confrimSegmentItemService.update(id, confirmSetId, segmentId, ConfirmSetSegment, user);
  }

  @Get(':segmentId/item')
  @UsePipes(new JoiValidationPipe({
    param: {
      confirmSetId: IdGeneralSchema,
      segmentId: IdGeneralSchema,
    },
    query: ConfirmSegmentItemQuerySchema,
  }))
  @UseGuards(AuthGuard(), ScopesGuard)
  @Scopes('confirm-segment:read')
  async queryItems(
    @Param('confirmSetId') confirmSetId: string,
    @Param('segmentId') segmentId: string,
    @Query() filters: ConfirmSegmentItemQueryDTO,
    @User() user: any,
  ): Promise<{ pagination: any, records: ConfirmSetSegmentItem[] }> {
    return await this.confrimSegmentItemService.filter(filters, confirmSetId,segmentId, user);
  }

  @Get(':segmentId/item/:id')
  @UsePipes(new JoiValidationPipe({
    param: {
      confirmSetId: IdSchema,
      segmentId: IdSchema,
      id: IdSchema,
    },
  }))
  @UseGuards(AuthGuard(), ScopesGuard)
  @Scopes('confirm-segment:read')
  async findItemById(
    @Param('id') id: string,
    @Param('segmentId') segmentId: string,
    @Param('confirmSetId') confirmSetId: string,
    @User() user: any,
  ): Promise<ConfirmSetSegmentItem> {
    return await this.confrimSegmentItemService.getById(id, confirmSetId,segmentId, user);
  }

  @Delete(':segmentId/item/:id')
  @UsePipes(new JoiValidationPipe({
    param: {
      confirmSetId: IdSchema,
      segmentId: IdSchema,
      id: IdSchema,
    },
  }))
  @UseGuards(AuthGuard(), ScopesGuard)
  @Scopes('confirm-segment:delete')
  async removeItemById(
    @Param('id') id: string,
    @Param('segmentId') segmentId: string,
    @Param('confirmSetId') confirmSetId: string,
    @User() user: any,
  ): Promise<{ message: string }> {
    return await this.confrimSegmentItemService.softDelete(id, confirmSetId,segmentId, user);
  }

  
  @Patch(':segmentId/item/:id/answer')
  @UsePipes(new JoiValidationPipe({
    param: {
      confirmSetId: IdSchema,
      segmentId: IdSchema,
      id: IdSchema,
    },
    body: ConfirmSegmentItemAnswerSchema,
  }))
  @UseGuards(AuthGuard(), ScopesGuard)
  @Scopes('confirm-segment:answer')
  async answerItem(
    @Body() item: ConfirmSegmentItemAnswerDTO,
    @Param('id') id: string,
    @Param('segmentId') segmentId: string,
    @Param('confirmSetId') confirmSetId: string,
    @User() user: any,
  ): Promise<ConfirmSetSegmentItem> {
    return await this.confrimSegmentItemService.update(id, confirmSetId, segmentId, {description:'', ...item}, user);
  }

  @Patch(':segmentId/item/:id/review')
  @UsePipes(new JoiValidationPipe({
    param: {
      confirmSetId: IdSchema,
      segmentId: IdSchema,
      id: IdSchema,
    },
    body: ConfirmSegmentItemReviewSchema,
  }))
  @UseGuards(AuthGuard(), ScopesGuard)
  @Scopes('confirm-segment:review')
  async reviewItem(
    @Body() item: ConfirmSegmentItemReviewDTO,
    @Param('id') id: string,
    @Param('segmentId') segmentId: string,
    @Param('confirmSetId') confirmSetId: string,
    @User() user: any,
  ): Promise<ConfirmSetSegmentItem> {
    return await this.confrimSegmentItemService.update(id, confirmSetId, segmentId, {...item}, user);
  }

}
