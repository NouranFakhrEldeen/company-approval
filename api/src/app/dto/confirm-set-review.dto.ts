import { ApiProperty } from '@nestjs/swagger';
import * as Joi from '@hapi/joi';
import { ConfirmSetReviewStatusEnum } from '../enums';


export class ConfirmSetReviewDTO {
    @ApiProperty({ description: `status "${Object.keys(ConfirmSetReviewStatusEnum).join()}"`, enum: ConfirmSetReviewStatusEnum, required: true })
    status?: ConfirmSetReviewStatusEnum;
}

const ConfirmSetReviewSchemaFactory = () => {
  const schema: any = {
    status: Joi.string().valid(...Object.keys(ConfirmSetReviewStatusEnum)).required(),
  }
  return Joi.object().keys(schema);
};
export const ConfirmSetReviewSchema = ConfirmSetReviewSchemaFactory();
