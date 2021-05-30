import { ApiProperty } from '@nestjs/swagger';
import * as Joi from '@hapi/joi';
import { ConfirmContactTypeEnum } from '../enums';

export class ConfirmContactQueryDTO {
  @ApiProperty({ description: `type "${Object.keys(ConfirmContactTypeEnum).join()}"`, enum: ConfirmContactTypeEnum, required: false })
  type?: ConfirmContactTypeEnum;

  @ApiProperty({ description: 'company id', required: false })
  companyId?: string;

  @ApiProperty({ description: 'company name', required: false })
  companyName?: string;

  @ApiProperty({ description: 'company business id', required: false })
  companyBusinessId?: string;

  @ApiProperty({ description: 'name', required: false })
  name?: string;

  @ApiProperty({ description: 'email', required: false })
  email?: string;

  @ApiProperty({ description: 'phone', required: false })
  phone?: string;

  @ApiProperty({ description: 'the page no for pangination', type: Number, required: false })
  page?: string;

  @ApiProperty({ description: 'the size of the page for pangination with max 1000, default 20', type: Number, required: false })
  size?: string;

  @ApiProperty({ description: 'From Date', type: Date, required: false })
  from?: Date;

  @ApiProperty({ description: 'To Date', type: Date, required: false })
  to?: Date;
}

const ConfirmContactQuerySchemaFactory = () => {
  const schema: any = {
    companyId: Joi.string().guid(),
    companyBusinessId: Joi.string().regex(/^.+$/),
    companyName: Joi.string(),
    type: Joi.string().valid(...Object.keys(ConfirmContactTypeEnum)),
    name: Joi.string(),
    email: Joi.string(),
    phone: Joi.string().regex(/^\d+$/),
    size: Joi.number().min(1).max(1000),
    page: Joi.number().min(1),
    from: Joi.date(),
    to: Joi.date(),
  }
  return Joi.object().keys(schema);
};
export const ConfirmContactQuerySchema = ConfirmContactQuerySchemaFactory();
