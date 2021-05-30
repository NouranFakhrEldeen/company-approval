import { ApiProperty } from '@nestjs/swagger';
import * as Joi from '@hapi/joi';

export class SegmentItemUpdateDTO {
  @ApiProperty({ description: 'number', required: false })
  number: string;

  @ApiProperty({ description: 'name', required: false })
  name: string;
}

const SegmentItemUpdateSchemaFactory = () => {
  const schema: any = {
    number: Joi.string().regex(/^\d+(\.\d+)*$/),
    name: Joi.string(),
  }
  return Joi.object().keys(schema);
};
export const SegmentItemUpdateSchema = SegmentItemUpdateSchemaFactory();
