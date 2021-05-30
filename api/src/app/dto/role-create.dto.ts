import { ApiProperty } from '@nestjs/swagger';
import * as Joi from '@hapi/joi';

export class RoleCreateDTO {
  @ApiProperty({ description: 'Role name', required: true })
  name: string;

  @ApiProperty({ description: 'Array of scopes', required: true })
  scopes: string[];
}

const RoleCreateSchemaFactory = () => {
  const schema: any = {
    name: Joi.string().required(),
    scopes: Joi.array().items(Joi.string().regex(/^(.+\:.+)$/).required()).min(1).required()
}
  return Joi.object().keys(schema);
};
export const RoleCreateSchema = RoleCreateSchemaFactory();
