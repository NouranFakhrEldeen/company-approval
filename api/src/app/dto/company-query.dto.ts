import { ApiProperty } from '@nestjs/swagger';
import * as Joi from '@hapi/joi';
import { CompanySortPropertiesEnum, SortTypeEnum } from '../enums';

export class CompanyQueryDTO {
  @ApiProperty({ description: 'company name', type: String, required: false })
  name?: string;

  @ApiProperty({ description: 'company bussiness id', type: String, required: false })
  businessId?: string;

  @ApiProperty({ description: 'general search', type: String, required: false })
  search?: string;

  @ApiProperty({ description: 'the page no for pangination', type: Number, required: false })
  page?: string;

  @ApiProperty({ description: 'the size of the page for pangination with max 1000, default 20', type: Number, required: false })
  size?: string;

  @ApiProperty({ description: 'From Date', type: Date, required: false })
  from?: Date;

  @ApiProperty({ description: 'To Date', type: Date, required: false })
  to?: Date;

  @ApiProperty({ description: `Sort type "${Object.keys(SortTypeEnum).join()}"`, enum: SortTypeEnum, required: false })
  sortType?: SortTypeEnum;

  @ApiProperty({ description: 'Sort property by property', enum: CompanySortPropertiesEnum, required: false })
  sortProperty?: CompanySortPropertiesEnum;
}

const CompanyQuerySchemaFactory = () => {
  const schema: any = {
    name: Joi.string(),
    businessId: Joi.string().regex(/^.+$/),
    search: Joi.string(),
    size: Joi.number().min(1).max(1000),
    page: Joi.number().min(1),
    from: Joi.date(),
    to: Joi.date(),
    sortType: Joi.string().valid(...Object.keys(SortTypeEnum)),
    sortProperty: Joi.string().valid(...Object.keys(CompanySortPropertiesEnum)),
  }
  return Joi.object().keys(schema);
};
export const CompanyQuerySchema = CompanyQuerySchemaFactory();