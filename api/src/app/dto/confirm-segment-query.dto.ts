import { ApiProperty } from '@nestjs/swagger';
import * as Joi from '@hapi/joi';
import { IdSchema } from '.';
import { ConfirmSegmentTypeEnum, SegmentStatusEnum } from '../enums';

export class ConfirmSegmentQueryDTO {
  @ApiProperty({ description: 'main segment id', required: false })
  segmentId: string;

  @ApiProperty({ description: 'name', required: false })
  name: string;

  @ApiProperty({ description: `type "${Object.keys(SegmentStatusEnum).join()}"`, enum: SegmentStatusEnum,  required: false })
  status?: SegmentStatusEnum;

  @ApiProperty({ description: `type "${Object.keys(ConfirmSegmentTypeEnum).join()}"`, enum: ConfirmSegmentTypeEnum,  required: false })
  type?: ConfirmSegmentTypeEnum;

  @ApiProperty({ description: 'the page no for pangination', type: Number, required: false })
  page?: string;

  @ApiProperty({ description: 'the size of the page for pangination with max 1000, default 20', type: Number, required: false })
  size?: string;

  @ApiProperty({ description: 'From Date', type: Date, required: false })
  from?: Date;

  @ApiProperty({ description: 'To Date', type: Date, required: false })
  to?: Date;
}

const ConfirmSegmentQuerySchemaFactory = () => {
  const schema: any = {
    segmentId: IdSchema,
    name: Joi.string(),
    status: Joi.string().valid(...Object.keys(SegmentStatusEnum)),
    type: Joi.string().valid(...Object.keys(ConfirmSegmentTypeEnum)),
    size: Joi.number().min(1).max(1000),
    page: Joi.number().min(1),
    from: Joi.date(),
    to: Joi.date(),
  }
  return Joi.object().keys(schema);
};
export const ConfirmSegmentQuerySchema = ConfirmSegmentQuerySchemaFactory();
