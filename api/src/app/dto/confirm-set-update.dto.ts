import { ApiProperty } from '@nestjs/swagger';
import * as Joi from '@hapi/joi';


export class ConfirmSetUpdateDTO {
  @ApiProperty({ description: 'start time', required: false })
  startTime?: Date;

  certificates?: string[];
}

const ConfirmSetUpdateSchemaFactory = () => {
  const schema: any = {
    startTime: Joi.date(),
  }
  return Joi.object().keys(schema);
};
export const ConfirmSetUpdateSchema = ConfirmSetUpdateSchemaFactory();
