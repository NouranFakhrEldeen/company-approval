import { ApiProperty } from '@nestjs/swagger';
import * as Joi from '@hapi/joi';
import { ConfirmContactTypeEnum } from '../enums';

export class InternalContactQueryDTO {
  @ApiProperty({ description: `type "${Object.keys(ConfirmContactTypeEnum).join()}"`, enum: ConfirmContactTypeEnum, required: false })
  type?: ConfirmContactTypeEnum;

  @ApiProperty({ description: 'company id', required: false })
  companyId?: string;

  @ApiProperty({ description: 'company name', required: false })
  companyName?: string;

  @ApiProperty({ description: 'company business id', required: false })
  companyBusinessId?: string;

  @ApiProperty({ description: 'name', required: false })
  name?: string;

  @ApiProperty({ description: 'email', required: false })
  email?: string;

  @ApiProperty({ description: 'phone', required: false })
  phone?: string;
}

const InternalContactQuerySchemaFactory = () => {
  const schema: any = {
    companyId: Joi.string().guid(),
    companyBusinessId: Joi.string().regex(/^.+$/),
    companyName: Joi.string(),
    type: Joi.string().valid(...Object.keys(ConfirmContactTypeEnum)),
    name: Joi.string(),
    email: Joi.string(),
    phone: Joi.string(),
  }
  return Joi.object().keys(schema);
};
export const InternalContactQuerySchema = InternalContactQuerySchemaFactory();
