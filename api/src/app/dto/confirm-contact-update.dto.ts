import { ApiProperty } from '@nestjs/swagger';
import * as Joi from '@hapi/joi';
import { ConfirmContactTypeEnum } from '../enums';

export class ConfirmContactUpdateDTO {
  @ApiProperty({ description: `type "${Object.keys(ConfirmContactTypeEnum).join()}"`, enum: ConfirmContactTypeEnum,  required: false })
  type: ConfirmContactTypeEnum;

  @ApiProperty({ description: 'name', required: false })
  name: string;

  @ApiProperty({ description: 'email', required: false })
  email: string;

  @ApiProperty({ description: 'phone', required: false })
  phone: string;
}

const ConfirmContactUpdateSchemaFactory = () => {
  const schema: any = {
    type: Joi.string().valid(...Object.keys(ConfirmContactTypeEnum)),
    name: Joi.string(),
    email: Joi.string().email({minDomainSegments: 2, tlds: { allow: false}}),
    phone: Joi.string().regex(/^\d+$/),
}
  return Joi.object().keys(schema);
};
export const ConfirmContactUpdateSchema = ConfirmContactUpdateSchemaFactory();
