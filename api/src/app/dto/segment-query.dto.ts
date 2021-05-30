import { ApiProperty } from '@nestjs/swagger';
import * as Joi from '@hapi/joi';
import { SegmentTypeEnum } from '../enums';

export class SegmentQueryDTO {
  @ApiProperty({ description: 'name', required: false })
  name?: string;

  @ApiProperty({ description: 'enabled', type:Boolean, required: false })
  enabled?: boolean;

  @ApiProperty({ description: `type "${Object.keys(SegmentTypeEnum).join()}"`, enum: SegmentTypeEnum, required: false })
  type?: SegmentTypeEnum;

  @ApiProperty({ description: 'the page no for pangination', type: Number, required: false })
  page?: string;

  @ApiProperty({ description: 'the size of the page for pangination with max 1000, default 20', type: Number, required: false })
  size?: string;

  @ApiProperty({ description: 'From Date', type: Date, required: false })
  from?: Date;

  @ApiProperty({ description: 'To Date', type: Date, required: false })
  to?: Date;

  checlistIds?: string[];
}

const SegmentQuerySchemaFactory = () => {
  const schema: any = {
    name: Joi.string(),
    enabled: Joi.boolean(),
    type: Joi.string().valid(...Object.keys(SegmentTypeEnum)),
    size: Joi.number().min(1).max(1000),
    page: Joi.number().min(1),
    from: Joi.date(),
    to: Joi.date(),
  }
  return Joi.object().keys(schema);
};
export const SegmentQuerySchema = SegmentQuerySchemaFactory();
