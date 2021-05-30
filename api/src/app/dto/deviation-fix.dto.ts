import { ApiProperty } from '@nestjs/swagger';
import * as Joi from '@hapi/joi';
import { IdSchema } from '.';


export class DeviationFixDTO {
  @ApiProperty({ description: 'images', type: [String], required: true })
  images?: string[];

  @ApiProperty({ description: 'how it was fixed', type: String, required: true })
  howItWasFixed?: string;

}

const DeviationFixSchemaFactory = () => {
  const schema: any = {
    images: Joi.array().items(IdSchema).required(),
    howItWasFixed: Joi.string().required(),
  }
  return Joi.object().keys(schema);
};
export const DeviationFixSchema = DeviationFixSchemaFactory();
