import { ApiProperty } from '@nestjs/swagger';
import * as Joi from '@hapi/joi';

export class ConfirmSegmentItemCreateDTO {
  @ApiProperty({ description: 'number in format 1.1.1.1', required: true })
  number: string;

  @ApiProperty({ description: 'name', required: true })
  name: string;
}

const ConfirmSegmentItemCreateSchemaFactory = () => {
  const schema: any = {
    number: Joi.string().regex(/^\d+(\.\d+)*$/).required(),
    name: Joi.string().required(),
  }
  return Joi.object().keys(schema);
};
export const ConfirmSegmentItemCreateSchema = ConfirmSegmentItemCreateSchemaFactory();
