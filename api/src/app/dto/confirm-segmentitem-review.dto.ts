import { ApiProperty } from '@nestjs/swagger';
import * as Joi from '@hapi/joi';

export class ConfirmSegmentItemReviewDTO {
  @ApiProperty({ description: 'comment', required: true })
  comment: string;
}

const ConfirmSegmentItemReviewSchemaFactory = () => {
  const schema: any = {
    comment: Joi.string().allow('').required(),
  }
  return Joi.object().keys(schema);
};
export const ConfirmSegmentItemReviewSchema = ConfirmSegmentItemReviewSchemaFactory();
