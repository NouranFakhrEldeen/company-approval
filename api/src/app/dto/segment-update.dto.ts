import { ApiProperty } from '@nestjs/swagger';
import * as Joi from '@hapi/joi';
import { SegmentTypeEnum } from '../enums';

export class SegmentUpdateDTO {
  @ApiProperty({ description: 'name', required: false })
  name: string;

  @ApiProperty({ description: 'enabled', type: Boolean, required: false })
  enabled: boolean;

  @ApiProperty({ description: `type "${Object.keys(SegmentTypeEnum).join()}"`, enum: SegmentTypeEnum, required: false })
  type: SegmentTypeEnum;

  @ApiProperty({ description: 'number', type: Number, required: false })
  index: number;
}

const SegmentUpdateSchemaFactory = () => {
  const schema: any = {
    index: Joi.number(),
    name: Joi.string(),
    enabled: Joi.boolean(),
    type: Joi.string().valid(...Object.keys(SegmentTypeEnum)),
  }
  return Joi.object().keys(schema);
};
export const SegmentUpdateSchema = SegmentUpdateSchemaFactory();
