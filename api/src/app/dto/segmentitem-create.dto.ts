import { ApiProperty } from '@nestjs/swagger';
import * as Joi from '@hapi/joi';

export class SegmentItemCreateDTO {
  @ApiProperty({ description: 'number', required: true })
  number: string;

  @ApiProperty({ description: 'name', required: true })
  name: string;
}

const SegmentItemCreateSchemaFactory = () => {
  const schema: any = {
    number: Joi.string().regex(/^\d+(\.\d+)*$/).required(),
    name: Joi.string().required(),
  }
  return Joi.object().keys(schema);
};
export const SegmentItemCreateSchema = SegmentItemCreateSchemaFactory();
