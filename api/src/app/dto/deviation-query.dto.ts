import { ApiProperty } from '@nestjs/swagger';
import * as Joi from '@hapi/joi';
import { DeviationStatusEnum } from '../enums';


export class DeviationQueryDTO {
  @ApiProperty({description: 'deviation number', type: String, required: false})
  number?: string;

  @ApiProperty({description: 'deviation status', enum: DeviationStatusEnum, required: false})
  status?: DeviationStatusEnum;

  @ApiProperty({ description: 'the page no for pangination', type: Number, required: false })
  page?: string;

  @ApiProperty({ description: 'the size of the page for pangination with max 1000, default 20', type: Number, required: false })
  size?: string;

  @ApiProperty({ description: 'From Date', type: Date, required: false })
  from?: Date;

  @ApiProperty({ description: 'To Date', type: Date, required: false })
  to?: Date;
}

const DeviationQuerySchemaFactory = () => {
  const schema: any = {
    number: Joi.string(),
    status: Joi.string().valid(...Object.keys(DeviationStatusEnum)),
    size: Joi.number().min(1).max(1000),
    page: Joi.number().min(1),
    from: Joi.date(),
    to: Joi.date(),
  }
  return Joi.object().keys(schema);
};
export const DeviationQuerySchema = DeviationQuerySchemaFactory();
