import { ApiProperty } from '@nestjs/swagger';
import * as Joi from '@hapi/joi';
import { IdSchema } from '.';


export class ConfirmSetUpdateCertificatesDTO {
  @ApiProperty({ description: 'start time', required: true })
  certificates: string[];
}

const ConfirmSetUpdateCertificateFactory = () => {
  const schema: any = {
    certificates: Joi.array().items(IdSchema),
  }
  return Joi.object().keys(schema);
};
export const ConfirmSetUpdateCertificate = ConfirmSetUpdateCertificateFactory();
