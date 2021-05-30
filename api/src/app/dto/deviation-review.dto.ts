import { ApiProperty } from '@nestjs/swagger';
import * as Joi from '@hapi/joi';
import { DeviationStatusReviewEnum } from '../enums';


export class DeviationReviewDTO {

  @ApiProperty({ description: 'admin comment', type: String, required: true })
  comment?: string;

  @ApiProperty({ description: `status "${Object.keys(DeviationStatusReviewEnum).join()}"`, enum: DeviationStatusReviewEnum, required: false })
  status?: DeviationStatusReviewEnum;


}

const DeviationReviewSchemaFactory = () => {
  const schema: any = {
    comment: Joi.string().required(),
    status: Joi.string().valid(...Object.keys(DeviationStatusReviewEnum)).required(),

  }
  return Joi.object().keys(schema);
};
export const DeviationReviewSchema = DeviationReviewSchemaFactory();
