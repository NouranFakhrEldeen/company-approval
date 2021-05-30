import { ApiProperty } from '@nestjs/swagger';
import * as Joi from '@hapi/joi';
import { IdSchema } from '.';

export class CompanyCreateDTO {
  @ApiProperty({ description: 'company name', required: true })
  name: string;

  @ApiProperty({ description: 'company bussiness id', required: true })
  businessId: string;
  
  @ApiProperty({ description: 'certificates', type: [String], required: false })
  certficates?: string[];
}

const CompanyCreateSchemaFactory = () => {
  const schema: any = {
    certificates: Joi.array().items(IdSchema),
    name: Joi.string().required(),
    businessId: Joi.string().regex(/^.+$/).required(),
}
  return Joi.object().keys(schema);
};
export const CompanyCreateSchema = CompanyCreateSchemaFactory();
