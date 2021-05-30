import { ApiProperty } from '@nestjs/swagger';
import * as Joi from '@hapi/joi';
import { AnswerItemSegmentEnum } from '../enums';

export class ConfirmSegmentItemQueryDTO {
  @ApiProperty({ description: 'number',type: String, required: false })
  number?: string;

  @ApiProperty({ description: 'name', required: false })
  name?: string;

  @ApiProperty({ description: `answer "${Object.keys(AnswerItemSegmentEnum).join()}"`, enum: AnswerItemSegmentEnum, required: false })
  answer?: AnswerItemSegmentEnum;

  @ApiProperty({ description: 'description', required: false })
  description?: string;

  @ApiProperty({ description: 'the page no for pangination', type: Number, required: false })
  page?: string;

  @ApiProperty({ description: 'the size of the page for pangination with max 1000, default 20', type: Number, required: false })
  size?: string;

  @ApiProperty({ description: 'From Date', type: Date, required: false })
  from?: Date;

  @ApiProperty({ description: 'To Date', type: Date, required: false })
  to?: Date;
}

const ConfirmSegmentItemQuerySchemaFactory = () => {
  const schema: any = {
    number: Joi.string().regex(/^\d+(\.\d+)*$/),
    name: Joi.string(),
    answer: Joi.string().valid(...Object.keys(AnswerItemSegmentEnum)),
    description: Joi.string(),
    size: Joi.number().min(1).max(1000),
    page: Joi.number().min(1),
    from: Joi.date(),
    to: Joi.date(),
  }
  return Joi.object().keys(schema);
};
export const ConfirmSegmentItemQuerySchema = ConfirmSegmentItemQuerySchemaFactory();
