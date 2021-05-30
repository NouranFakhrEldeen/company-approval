import { Controller, Get, UsePipes, UseGuards, Query, Param, Body, Post, Patch, Delete } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

import { JoiValidationPipe } from '../pipes';

import {
  IdSchema,
  RoleCreateDTO, RoleCreateSchema,
  RoleQueryDTO, RoleQuerySchema,
  RoleUpdateDTO, RoleUpdateSchema,
} from '../dto';

import { RoleService } from '../services';

import { ScopesGuard } from '../guards';
import { AuthGuard } from '@nestjs/passport';

import { Scopes, User } from '../decorators';
import { Role } from '../entities';

@ApiTags('Role')
@ApiBearerAuth()
@Controller('')

export class RoleController {
  constructor(private readonly rolesService: RoleService) { }

  @Post()
  @UsePipes(new JoiValidationPipe({
    body: RoleCreateSchema,
  }))
  @UseGuards(AuthGuard(), ScopesGuard)
  @Scopes('roles:create')
  async add(
    @Body() Role: RoleCreateDTO,
    @User() user: any,//IUser,
  ): Promise<Role> {
    return await this.rolesService.create(Role, user);
  }

  @Patch(':id')
  @UsePipes(new JoiValidationPipe({
    param: {
      id: IdSchema,
    },
    body: RoleUpdateSchema,
  }))
  @UseGuards(AuthGuard(), ScopesGuard)
  @Scopes('roles:update')
  async update(
    @Body() Role: RoleUpdateDTO,
    @Param('id') id: string,
    @User() user: any,//IUser,
  ): Promise<Role> {
    return await this.rolesService.update(id, Role, user);
  }

  @Get()
  @UsePipes(new JoiValidationPipe({
    query: RoleQuerySchema,
  }))
  @UseGuards(AuthGuard(), ScopesGuard)
  @Scopes('roles:read')
  async query(
    @Query() filters: RoleQueryDTO,
    @User() user: any,//IUser,
  ): Promise<{ pagination: any, records: Role[] }> {
    return await this.rolesService.filter(filters, user);
  }

  @Get(':id')
  @UsePipes(new JoiValidationPipe({
    param: {
      id: IdSchema,
    },
  }))
  @UseGuards(AuthGuard(), ScopesGuard)
  @Scopes('roles:read')
  async findById(
    @Param('id') id: string,
    @User() user: any,//IUser,
  ): Promise<Role> {
    return await this.rolesService.getById(id, user);
  }

  @Delete(':id')
  @UsePipes(new JoiValidationPipe({
    param: {
      id: IdSchema,
    },
  }))
  @UseGuards(AuthGuard(), ScopesGuard)
  @Scopes('roles:delete')
  async removeById(
    @Param('id') id: string,
    @User() user: any,//IUser,
  ): Promise<{ message: string }> {
    return await this.rolesService.softDelete(id, user);
  }

}
