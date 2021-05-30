import { ApiProperty } from '@nestjs/swagger';
import * as Joi from '@hapi/joi';
import { AnswerItemSegmentEnum } from '../enums';
// import { AnswerItemSegmentEnum } from '../enums';

export class ConfirmSegmentItemUpdateDTO {
  @ApiProperty({ description: 'number', required: false })
  number?: string;

  @ApiProperty({ description: 'name', required: false })
  name?: string;

  answer?: AnswerItemSegmentEnum;
  description?: string;
  comment?: string;
}

const ConfirmSegmentItemUpdateSchemaFactory = () => {
  const schema: any = {
    number: Joi.string().regex(/^\d+(\.\d+)*$/),
    name: Joi.string(),
  }
  return Joi.object().keys(schema);
};
export const ConfirmSegmentItemUpdateSchema = ConfirmSegmentItemUpdateSchemaFactory();
