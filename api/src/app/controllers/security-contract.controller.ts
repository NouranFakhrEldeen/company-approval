import { Controller, Get, UsePipes, UseGuards, Query, Param, Body, Post, Patch, Delete } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

import { JoiValidationPipe } from '../pipes';

import {
  IdSchema,
  SecurityContractQueryDTO, SecurityContractQuerySchema,
} from '../dto';

import { SecurityContractService } from '../services';

import { ScopesGuard } from '../guards';
import { AuthGuard } from '@nestjs/passport';

import { Scopes, User } from '../decorators';
import { SecurityContract } from '../entities';

@ApiTags('SecurityContract')
@ApiBearerAuth()
@Controller('')

export class SecurityContractController {
  constructor(private readonly rolesService: SecurityContractService) { }


  @Get()
  @UsePipes(new JoiValidationPipe({
    query: SecurityContractQuerySchema,
  }))
  @UseGuards(AuthGuard(), ScopesGuard)
  @Scopes('security-contract:read')
  async query(
    @Query() filters: SecurityContractQueryDTO,
    @User() user: any,
  ): Promise<{ pagination: any, records: SecurityContract[] }> {
    return await this.rolesService.filter(filters, user);
  }

  @Get(':id')
  @UsePipes(new JoiValidationPipe({
    param: {
      id: IdSchema,
    },
  }))
  @UseGuards(AuthGuard(), ScopesGuard)
  @Scopes('security-contract:read')
  async findById(
    @Param('id') id: string,
    @User() user: any,
  ): Promise<SecurityContract> {
    return await this.rolesService.getById(id, user);
  }

}
