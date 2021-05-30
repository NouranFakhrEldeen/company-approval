import { ApiProperty } from '@nestjs/swagger';
import * as Joi from '@hapi/joi';
import { RoleSortPropertiesEnum, SortTypeEnum } from '../enums';

export class RoleQueryDTO {
  @ApiProperty({ description: 'role name', type: String, required: false })
  name?: string;

  @ApiProperty({ description: 'scope', type: String, required: false })
  scope?: string;

  @ApiProperty({ description: 'the page no for pangination', required: false })
  page?: string;

  @ApiProperty({ description: 'the size of the page for pangination with max 1000, default 20', required: false })
  size?: string;
  
  @ApiProperty({ description: 'From Date', type: Date, required: false })
  from?: Date;

  @ApiProperty({ description: 'To Date', type: Date, required: false })
  to?: Date;

  @ApiProperty({ description: `Sort type "${Object.keys(SortTypeEnum).join()}"`, enum: SortTypeEnum, required: false })
  sortType?: SortTypeEnum;

  @ApiProperty({ description: 'Sort property by property', enum: RoleSortPropertiesEnum, required: false })
  sortProperty?: RoleSortPropertiesEnum;
}

const RoleQuerySchemaFactory = () => {
  const schema: any = {
    name: Joi.string(),
    scope: Joi.string().regex(/^(.+\:.+)$/),
    size: Joi.number().min(1).max(1000),
    page: Joi.number().min(1),
    from: Joi.date(),
    to: Joi.date(),
    sortType: Joi.string().valid(...Object.keys(SortTypeEnum)),
    sortProperty: Joi.string().valid(...Object.keys(RoleSortPropertiesEnum)),
  }
  return Joi.object().keys(schema);
};
export const RoleQuerySchema = RoleQuerySchemaFactory();