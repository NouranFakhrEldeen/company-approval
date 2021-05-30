import { Controller, Get, UsePipes, UseGuards, Query, Param, Body, Post, Patch, Delete } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

import { JoiValidationPipe } from '../pipes';

import {
  CompanyCreateDTO, CompanyCreateSchema,
  CompanyQueryDTO, CompanyQuerySchema,
  CompanyUpdateDTO, CompanyUpdateSchema, IdSchema,
} from '../dto';

import { CompanyService } from '../services';

import { ScopesGuard } from '../guards';
import { AuthGuard } from '@nestjs/passport';

import { Scopes, User } from '../decorators';
import { Company } from '../entities';

@ApiTags('Company')
@ApiBearerAuth()
@Controller('')

export class CompanyController {
  constructor(private readonly companiesService: CompanyService) { }

  @Post()
  @UsePipes(new JoiValidationPipe({
    body: CompanyCreateSchema,
  }))
  @UseGuards(AuthGuard(), ScopesGuard)
  @Scopes('companies:create')
  async add(
    @Body() Company: CompanyCreateDTO,
    @User() user: any,//IUser,
  ): Promise<Company> {
    return await this.companiesService.create(Company, user);
  }

  @Patch(':id')
  @UsePipes(new JoiValidationPipe({
    param: {
      id: IdSchema,
    },
    body: CompanyUpdateSchema,
  }))
  @UseGuards(AuthGuard(), ScopesGuard)
  @Scopes('companies:update')
  async update(
    @Body() Company: CompanyUpdateDTO,
    @Param('id') id: string,
    @User() user: any,//IUser,
  ): Promise<Company> {
    return await this.companiesService.update(id, Company, user);
  }

  @Get()
  @UsePipes(new JoiValidationPipe({
    query: CompanyQuerySchema,
  }))
  @UseGuards(AuthGuard(), ScopesGuard)
  @Scopes('companies:read')
  async query(
    @Query() filters: CompanyQueryDTO,
    @User() user: any,//IUser,
  ): Promise<{ pagination: any, records: Company[] }> {
    return await this.companiesService.filter(filters, user);
  }

  @Get(':id')
  @UsePipes(new JoiValidationPipe({
    param: {
      id: IdSchema,
    },
  }))
  @UseGuards(AuthGuard(), ScopesGuard)
  @Scopes('companies:read')
  async findById(
    @Param('id') id: string,
    @User() user: any,//IUser,
  ): Promise<Company> {
    return await this.companiesService.getById(id, user);
  }

  @Delete(':id')
  @UsePipes(new JoiValidationPipe({
    param: {
      id: IdSchema,
    },
  }))
  @UseGuards(AuthGuard(), ScopesGuard)
  @Scopes('companies:delete')
  async removeById(
    @Param('id') id: string,
    @User() user: any,//IUser,
  ): Promise<{ message: string }> {
    return await this.companiesService.softDelete(id, user);
  }

}
