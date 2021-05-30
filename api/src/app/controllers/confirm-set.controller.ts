import { Controller, Get, UsePipes, UseGuards, Query, Param, Body, Post, Patch, Delete } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

import { JoiValidationPipe } from '../pipes';

import {
  IdSchema,
  ConfirmSetCreateDTO, ConfirmSetCreateSchema,
  ConfirmSetUpdateDTO, ConfirmSetUpdateSchema,
  ConfirmSetQueryDTO, ConfirmSetQuerySchema, ConfirmSetReviewSchema, ConfirmSetReviewDTO, ConfirmSetUpdateCertificatesDTO,
} from '../dto';
import  { ConfirmSetService } from '../services';
import { ScopesGuard } from '../guards';
import { AuthGuard } from '@nestjs/passport';

import { Scopes, User } from '../decorators';
import { ConfirmSet } from '../entities';

@ApiTags('Confirm Set')
@ApiBearerAuth()
@Controller('')

export class ConfirmSetController {
  constructor(
    private readonly confirmSetService: ConfirmSetService,
  ) { }

  @Post()
  @UsePipes(new JoiValidationPipe({
    body: ConfirmSetCreateSchema,
  }))
  @UseGuards(AuthGuard(), ScopesGuard)
  @Scopes('confirm-set:create')
  async add(
    @Body() confirmSet: ConfirmSetCreateDTO,
    @User() user: any,
  ): Promise<ConfirmSet> {
    return await this.confirmSetService.create(confirmSet, user);
  }

  @Patch(':id')
  @UsePipes(new JoiValidationPipe({
    param: {
      id: IdSchema,
    },
    body: ConfirmSetUpdateSchema,
  }))
  @UseGuards(AuthGuard(), ScopesGuard)
  @Scopes('confirm-set:update')
  async update(
    @Body() confirmSet: ConfirmSetUpdateDTO,
    @Param('id') id: string,
    @User() user: any,
  ): Promise<ConfirmSet> {
    return await this.confirmSetService.update(id, confirmSet, user);
  }

  @Patch(':id/submit-answer')
  @UsePipes(new JoiValidationPipe({
    param: {
      id: IdSchema,
    }
  }))
  @UseGuards(AuthGuard(), ScopesGuard)
  @Scopes('confirm-set:update')
  async answer(
    @Param('id') id: string,
    @User() user: any,
  ): Promise<ConfirmSet> {
    return await this.confirmSetService.submitAnswer(id, user);
  }

  @Patch(':id/submit-review')
  @UsePipes(new JoiValidationPipe({
    param: {
      id: IdSchema,
    },
    body: ConfirmSetReviewSchema
  }))
  @UseGuards(AuthGuard(), ScopesGuard)
  @Scopes('confirm-set:review')
  async review(
    @Param('id') id: string,
    @User() user: any,
    @Body() data: ConfirmSetReviewDTO,
  ): Promise<ConfirmSet> {
    return await this.confirmSetService.submitReview(id, data, user);
  }

  @Patch(':id/certificates')
  @UsePipes(new JoiValidationPipe({
    param: {
      id: IdSchema,
    },
    body: ConfirmSetUpdateCertificatesDTO
  }))
  @UseGuards(AuthGuard(), ScopesGuard)
  @Scopes('confirm-set:certificates')
  async updateCertificates(
    @Param('id') id: string,
    @User() user: any,
    @Body() confirmSet: ConfirmSetUpdateCertificatesDTO,
    ): Promise<ConfirmSet> {
      return await this.confirmSetService.update(id, confirmSet, user);
  }

  @Get()
  @UsePipes(new JoiValidationPipe({
    query: ConfirmSetQuerySchema,
  }))
  @UseGuards(AuthGuard(), ScopesGuard)
  @Scopes('confirm-set:read')
  async query(
    @Query() filters: ConfirmSetQueryDTO,
    @User() user: any,
  ): Promise<{ pagination: any, records: ConfirmSet[] }> {
    return await this.confirmSetService.filter(filters, user);
  }

  @Get(':id')
  @UsePipes(new JoiValidationPipe({
    param: {
      id: IdSchema,
    },
  }))
  @UseGuards(AuthGuard(), ScopesGuard)
  @Scopes('confirm-set:read')
  async findById(
    @Param('id') id: string,
    @User() user: any,
  ): Promise<ConfirmSet> {
    return await this.confirmSetService.getById(id, user);
  }

  @Get(':id/certificates')
  @UsePipes(new JoiValidationPipe({
    param: {
      id: IdSchema,
    },
  }))
  @UseGuards(AuthGuard(), ScopesGuard)
  @Scopes('confirm-set:read')
  async certificatesById(
    @Param('id') id: string,
    @User() user: any,
  ): Promise<ConfirmSet> {
    return await this.confirmSetService.getCertificatesById(id, user);
  }
  @Delete(':id')
  @UsePipes(new JoiValidationPipe({
    param: {
      id: IdSchema,
    },
  }))
  @UseGuards(AuthGuard(), ScopesGuard)
  @Scopes('confirm-set:delete')
  async removeById(
    @Param('id') id: string,
    @User() user: any,
  ): Promise<{ message: string }> {
    return await this.confirmSetService.softDelete(id, user);
  }

  @Patch(':id/devaition-status')
  @UsePipes(new JoiValidationPipe({
    param: {
      id: IdSchema,
    },
  }))
  @UseGuards(AuthGuard(), ScopesGuard)
  @Scopes('confirm-set:review-status')
  async reviewStatus(
    @Param('id') id: string,
    @User() user: any,
  ): Promise<ConfirmSet> {
    return await this.confirmSetService.changeAdminStatus(id, user);
  }

  @Patch(':id/submit-deviation-answer')
  @UsePipes(new JoiValidationPipe({
    param: {
      id: IdSchema,
    },
  }))
  @UseGuards(AuthGuard(), ScopesGuard)
  @Scopes('confirm-set:update')
  async answerStatus(
    @Param('id') id: string,
    @User() user: any,
  ): Promise<ConfirmSet> {
    return await this.confirmSetService.changeSupplierStatus(id, user);
  }

}
