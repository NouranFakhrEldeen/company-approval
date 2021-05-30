import { ApiProperty } from '@nestjs/swagger';
import * as Joi from '@hapi/joi';
import { SegmentItemCreateDTO, SegmentItemCreateSchema } from '.';
import { SegmentTypeEnum } from '../enums';
import { MongoIdSchema } from './mongo-id.dto';

export class SegmentCreateDTO {
  @ApiProperty({ description: 'audit tool checklist id', required: true })
  checklistId: string;

  @ApiProperty({ description: 'name', required: true })
  name: string;

  @ApiProperty({ description: 'enabled', type: Boolean, required: true })
  enabled: boolean;

  @ApiProperty({ description: `type "${Object.keys(SegmentTypeEnum).join()}"`, enum: SegmentTypeEnum, required: true })
  type: SegmentTypeEnum;

  @ApiProperty({ description: 'items', type: [SegmentItemCreateDTO], required: false })
  items: SegmentItemCreateDTO[];

  @ApiProperty({ description: 'number', type: Number, required: true })
  index: number;

  owner?: string;
  creator?:string;
}
const SegmentCreateSchemaFactory = () => {
  const schema: any = {
    checklistId: MongoIdSchema.required(),
    name: Joi.string().required(),
    type: Joi.string().valid(...Object.keys(SegmentTypeEnum)).required(),
    enabled: Joi.boolean().required(),
    index: Joi.number().required(),
    items: Joi.array().items(SegmentItemCreateSchema),
  }
  return Joi.object().keys(schema);
};
export const SegmentCreateSchema = SegmentCreateSchemaFactory();
