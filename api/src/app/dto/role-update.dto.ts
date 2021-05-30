import { ApiProperty } from '@nestjs/swagger';
import * as Joi from '@hapi/joi';


export class RoleUpdateDTO {
  @ApiProperty({description: 'role name', type: String, required: false})
  name?: string;
  @ApiProperty({description: 'array of scopes', type: [String], required: false})
  scopes?: string[];
}

const RoleUpdateSchemaFactory = () => {
  const schema: any = {
    name: Joi.string(),
    scopes: Joi.array().items(Joi.string().regex(/^(.+\:.+)$/).required()).min(1)
  }
  return Joi.object().keys(schema);
};
export const RoleUpdateSchema = RoleUpdateSchemaFactory();
