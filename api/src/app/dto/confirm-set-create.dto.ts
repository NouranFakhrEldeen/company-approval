import { ApiProperty } from '@nestjs/swagger';
import * as Joi from '@hapi/joi';
import { 
  ConfirmContactCreateDTO, ConfirmContactCreateSchema,
  IdSchema,
} from '.';
import { ConfirmSegmentCreateDTO, ConfirmSegmentCreateSchema } from './confirm-segment-create.dto';
import { ConfirmSetCreateStatusEnum } from '../enums';

export class ConfirmSetCreateDTO {
  @ApiProperty({ description: 'company id', required: true })
  companyId: string;

  @ApiProperty({ description: 'start time', type: Date, required: true })
  startTime: any;
  
  @ApiProperty({ description: 'contacts', type: [ConfirmContactCreateDTO], required: false })
  contacts: ConfirmContactCreateDTO[];

  @ApiProperty({ description: 'segments', type: [ConfirmSegmentCreateDTO], required: true })
  segments: ConfirmSegmentCreateDTO[];

  @ApiProperty({ description: 'certificates', type: [String], required: false })
  certficates: string[];

  @ApiProperty({ description: 'confirm set status Default is "COMPANY_FILLING"', enum: ConfirmSetCreateStatusEnum, required: false })
  status: ConfirmSetCreateStatusEnum;

  @ApiProperty({ description: 'approve time, required if status is COMPLETED', type: Date, required: false })
  approvedTime: any;
}

const ConfirmSetCreateSchemaFactory = () => {
  const schema: any = {
    companyId: IdSchema,
    startTime: Joi.date().required(),
    contacts: Joi.array().items(ConfirmContactCreateSchema),
    segments: Joi.array().items(ConfirmSegmentCreateSchema),
    certificates: Joi.array().items(IdSchema),
    status: Joi.string().valid(...Object.keys(ConfirmSetCreateStatusEnum)),
    approvedTime: Joi.date()
  }
  schema.approvedTime = Joi.date().when(
    'status',
    { is: ConfirmSetCreateStatusEnum.COMPLETED, then: Joi.required(), otherwise: Joi.forbidden()}
  );
  return Joi.object().keys(schema);
};
export const ConfirmSetCreateSchema = ConfirmSetCreateSchemaFactory();

