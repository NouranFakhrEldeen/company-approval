import { ApiProperty } from '@nestjs/swagger';
import * as Joi from '@hapi/joi';


export class CompanyUpdateDTO {
  @ApiProperty({ description: 'company name', required: false })
  name: string;

  @ApiProperty({ description: 'company bussiness id', required: false })
  businessId: string;
}

const CompanyUpdateSchemaFactory = () => {
  const schema: any = {
    name: Joi.string(),
    businessId: Joi.string().regex(/^.+$/),
  }
  return Joi.object().keys(schema);
};
export const CompanyUpdateSchema = CompanyUpdateSchemaFactory();
