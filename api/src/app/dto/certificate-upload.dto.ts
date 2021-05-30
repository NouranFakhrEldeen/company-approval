import { ApiProperty } from '@nestjs/swagger';
import * as Joi from '@hapi/joi';
import { IdSchema } from './id.dto';

export class CertificatUploadDto {
  @ApiProperty({description: 'Binary certificate file', type: 'string', format: 'binary' })
  file: any;

  @ApiProperty({description: 'Confirm set Id', type: String, required: false })
  confirmSetId?: string;

  @ApiProperty({description: 'Company Id', type: String, required: false })
  companyId?: string;
}

export class CreateCertificateDto {
  @ApiProperty({description: 'Confirm set Id', type: String, required: false })
  confirmSetId?: string;

  @ApiProperty({description: 'Company Id', type: String, required: false })
  companyId?: string;
}

const CreateCertificateSchemaFactory = () => {
  const schema: any = {
    confirmSetId: IdSchema,
    companyId: IdSchema,
}
  return Joi.object().keys(schema);
};
export const CreateCertificateSchema = CreateCertificateSchemaFactory();
