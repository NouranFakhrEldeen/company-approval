import { ApiProperty } from '@nestjs/swagger';
import * as Joi from '@hapi/joi';
import { ConfirmContactTypeEnum } from '../enums';

export class ConfirmContactCreateDTO {
  @ApiProperty({ description: `type "${Object.keys(ConfirmContactTypeEnum).join()}"`, enum: ConfirmContactTypeEnum, required: true })
  type: ConfirmContactTypeEnum;

  @ApiProperty({ description: 'name', required: true })
  name: string;

  @ApiProperty({ description: 'email', required: true })
  email: string;

  @ApiProperty({ description: 'phone', required: false })
  phone: string;
}

const ConfirmContactCreateSchemaFactory = () => {
  const schema: any = {
    type: Joi.string().valid(...Object.keys(ConfirmContactTypeEnum)).required(),
    name: Joi.string().required(),
    email: Joi.string().email({minDomainSegments: 2, tlds: { allow: false}}).required(),
    phone: Joi.string().regex(/^\d+$/),
}
  return Joi.object().keys(schema);
};
export const ConfirmContactCreateSchema = ConfirmContactCreateSchemaFactory();
