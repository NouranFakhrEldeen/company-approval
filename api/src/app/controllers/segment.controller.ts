import { Controller, Get, UsePipes, UseGuards, Query, Param, Body, Post, Patch, Delete } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

import { JoiValidationPipe } from '../pipes';

import {
  IdGeneralSchema,
  IdSchema,
  SegmentCreateDTO, SegmentCreateSchema,
  SegmentItemCreateDTO,
  SegmentItemCreateSchema,
  SegmentItemQueryDTO,
  SegmentItemQuerySchema,
  SegmentItemUpdateDTO,
  SegmentItemUpdateSchema,
  SegmentQueryDTO, SegmentQuerySchema,
  SegmentUpdateDTO, SegmentUpdateSchema,
} from '../dto';

import { SegmentItemService, SegmentService } from '../services';

import { ScopesGuard } from '../guards';
import { AuthGuard } from '@nestjs/passport';

import { Scopes, User } from '../decorators';
import { Segment, SegmentItem } from '../entities';

@ApiTags('Segment')
@ApiBearerAuth()
@Controller('')

export class SegmentController {
  constructor(
    private readonly segmentService: SegmentService,
    private readonly segmentItemService: SegmentItemService,
  ) { }

  @Post()
  @UsePipes(new JoiValidationPipe({
    body: SegmentCreateSchema,
  }))
  @UseGuards(AuthGuard(), ScopesGuard)
  @Scopes('segment:create')
  async add(
    @Body() Segment: SegmentCreateDTO,
    @User() user: any,
  ): Promise<Segment> {
    return await this.segmentService.create(Segment, user);
  }

  @Patch(':id')
  @UsePipes(new JoiValidationPipe({
    param: {
      id: IdSchema.required(),
    },
    body: SegmentUpdateSchema,
  }))
  @UseGuards(AuthGuard(), ScopesGuard)
  @Scopes('segment:update')
  async update(
    @Body() Segment: SegmentUpdateDTO,
    @Param('id') id: string,
    @User() user: any,
  ): Promise<Segment> {
    return await this.segmentService.update(id, Segment, user);
  }

  @Get()
  @UsePipes(new JoiValidationPipe({
    query: SegmentQuerySchema,
  }))
  @UseGuards(AuthGuard(), ScopesGuard)
  @Scopes('segment:read')
  async query(
    @Query() filters: SegmentQueryDTO,
    @User() user: any,
  ): Promise<{ pagination: any, records: Segment[] }> {
    return await this.segmentService.filter(filters, user);
  }

  @Get(':id')
  @UsePipes(new JoiValidationPipe({
    param: {
      id: IdSchema.required(),
    },
  }))
  @UseGuards(AuthGuard(), ScopesGuard)
  @Scopes('segment:read')
  async findById(
    @Param('id') id: string,
    @User() user: any,
  ): Promise<Segment> {
    return await this.segmentService.getById(id, user);
  }

  @Delete(':id')
  @UsePipes(new JoiValidationPipe({
    param: {
      id: IdSchema.required(),
    },
  }))
  @UseGuards(AuthGuard(), ScopesGuard)
  @Scopes('segment:delete')
  async removeById(
    @Param('id') id: string,
    @User() user: any,
  ): Promise<{ message: string }> {
    return await this.segmentService.softDelete(id, user);
  }

  
  @Post(':segmentId/item')
  @UsePipes(new JoiValidationPipe({
    param: {
      segmentId: IdSchema.required(),
    },
    body: SegmentItemCreateSchema,
  }))
  @UseGuards(AuthGuard(), ScopesGuard)
  @Scopes('segment:create')
  async addItem(
    @Body() Segment: SegmentItemCreateDTO,
    @Param('segmentId') segmentId: string,
    @User() user: any,
  ): Promise<Segment> {
    return await this.segmentItemService.create(Segment, segmentId, user);
  }

  @Patch(':segmentId/item/:id')
  @UsePipes(new JoiValidationPipe({
    param: {
      id: IdSchema.required(),
      segmentId: IdSchema.required(),
    },
    body: SegmentItemUpdateSchema,
  }))
  @UseGuards(AuthGuard(), ScopesGuard)
  @Scopes('segment:update')
  async updateItem(
    @Body() Segment: SegmentItemUpdateDTO,
    @Param('id') id: string,
    @Param('segmentId') segmentId: string,
    @User() user: any,
  ): Promise<SegmentItem> {
    return await this.segmentItemService.update(id,segmentId, Segment, user);
  }

  @Get(':segmentId/item')
  @UsePipes(new JoiValidationPipe({
    param: {
      segmentId: IdGeneralSchema.required(),
    },
    query: SegmentItemQuerySchema,
  }))
  @UseGuards(AuthGuard(), ScopesGuard)
  @Scopes('segment:read')
  async queryItems(
    @Param('segmentId') segmentId: string,
    @Query() filters: SegmentItemQueryDTO,
    @User() user: any,
  ): Promise<{ pagination: any, records: SegmentItem[] }> {
    return await this.segmentItemService.filter(filters,segmentId, user);
  }

  @Get(':segmentId/item/:id')
  @UsePipes(new JoiValidationPipe({
    param: {
      id: IdSchema.required(),
      segmentId: IdSchema.required(),
    }
  }))
  @UseGuards(AuthGuard(), ScopesGuard)
  @Scopes('segment:read')
  async findItemById(
    @Param('id') id: string,
    @Param('segmentId') segmentId: string,
    @User() user: any,
  ): Promise<SegmentItem> {
    return await this.segmentItemService.getById(id,segmentId, user);
  }

  @Delete(':segmentId/item/:id')
  @UsePipes(new JoiValidationPipe({
    param: {
      id: IdSchema.required(),
      segmentId: IdSchema.required(),
    }
  }))
  @UseGuards(AuthGuard(), ScopesGuard)
  @Scopes('segment:delete')
  async removeItemById(
    @Param('id') id: string,
    @Param('segmentId') segmentId: string,
    @User() user: any,
  ): Promise<{ message: string }> {
    return await this.segmentItemService.softDelete(id,segmentId, user);
  }

}
