import { ApiProperty } from '@nestjs/swagger';
import * as Joi from '@hapi/joi';
import { AnswerItemSegmentEnum } from '../enums';

export class ConfirmSegmentItemAnswerDTO {
  @ApiProperty({ description: `answer "${Object.keys(AnswerItemSegmentEnum).join()}"`, enum: AnswerItemSegmentEnum, required: true })
  answer: AnswerItemSegmentEnum;

  @ApiProperty({ description: 'description', required: false })
  description: string;
}

const ConfirmSegmentItemAnswerSchemaFactory = () => {
  const schema: any = {
    answer: Joi.string().valid(...Object.keys(AnswerItemSegmentEnum)).required(),
    description: Joi.string().when(
      'answer',
      { is: AnswerItemSegmentEnum.NO, then: Joi.required(), otherwise: Joi.optional() },
    ),
  }
  return Joi.object().keys(schema);
};
export const ConfirmSegmentItemAnswerSchema = ConfirmSegmentItemAnswerSchemaFactory();
