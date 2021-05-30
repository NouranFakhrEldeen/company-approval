import { ApiProperty } from '@nestjs/swagger';
import * as Joi from '@hapi/joi';
import { IdSchema } from '.';
import { ConfirmSetStatusEnum, SortConfirmPropertyEnum, SortTypeEnum } from '../enums';

export class ConfirmSetQueryDTO {
  @ApiProperty({ description: 'company id', required: false })
  companyId?: string;

  @ApiProperty({ description: ` status ${Object.keys(ConfirmSetStatusEnum).join()} you can add many separated by comma`,
   type: String, required: false })
  status?: string;

  @ApiProperty({ description: 'Certificate Id', type: String, required: false })
  certificateId?: string;

  @ApiProperty({ description: 'Audit Round Id', type: String, required: false })
  auditRoundId?: string;

  @ApiProperty({ description: 'From Start Date', type: Date, required: false })
  fromStartDate?: Date;

  @ApiProperty({ description: 'To Start Date', type: Date, required: false })
  toStartDate?: Date;

  @ApiProperty({ description: 'From Approved Date', type: Date, required: false })
  fromApprovedTime?: Date;

  @ApiProperty({ description: 'To Approved Date', type: Date, required: false })
  toApprovedTime?: Date;

  @ApiProperty({ description: 'From Declined Date', type: Date, required: false })
  fromDeclinedTime?: Date;

  @ApiProperty({ description: 'To Declined Date', type: Date, required: false })
  toDeclinedTime?: Date;

  @ApiProperty({ description: 'From Audited Date', type: Date, required: false })
  fromAuditedTime?: Date;

  @ApiProperty({ description: 'To Audited Date', type: Date, required: false })
  toAuditedTime?: Date;

  @ApiProperty({ description: 'From InDeviation Date', type: Date, required: false })
  fromInDeviationTime?: Date;

  @ApiProperty({ description: 'To InDeviation Date', type: Date, required: false })
  toInDeviationTime?: Date;

  @ApiProperty({ description: 'the page no for pangination', type: Number, required: false })
  page?: string;

  @ApiProperty({ description: 'the size of the page for pangination with max 1000, default 20', type: Number, required: false })
  size?: string;

  @ApiProperty({ description: 'From Date', type: Date, required: false })
  from?: Date;

  @ApiProperty({ description: 'To Date', type: Date, required: false })
  to?: Date;

  @ApiProperty({ description: `Sort type "${Object.keys(SortTypeEnum).join()}"`, enum: SortTypeEnum, required: false })
  sortType?: SortTypeEnum;

  @ApiProperty({ description: 'Sort property', enum: SortConfirmPropertyEnum, required: false })
  sortProperty?: SortConfirmPropertyEnum;
}

const ConfirmSetQuerySchemaFactory = () => {
  const schema: any = {
    companyId: IdSchema,
    status: Joi.string().regex(new RegExp(`^(${Object.keys(ConfirmSetStatusEnum).join('|')})+(,(${Object.keys(ConfirmSetStatusEnum).join('|')}))*$`)),
    certificateId: IdSchema,
    auditRoundId: Joi.string(),
    fromStartDate: Joi.date(),
    toStartDate: Joi.date(),
    fromApprovedTime: Joi.date(),
    toApprovedTime: Joi.date(),
    fromDeclinedTime: Joi.date(),
    toDeclinedTime: Joi.date(),
    fromAuditedTime: Joi.date(),
    toAuditedTime: Joi.date(),
    fromInDeviationTime: Joi.date(),
    toInDeviationTime: Joi.date(),
    sortType: Joi.string().valid(...Object.keys(SortTypeEnum)),
    sortProperty: Joi.string().valid(...Object.keys(SortConfirmPropertyEnum)),
    size: Joi.number().min(1).max(1000),
    page: Joi.number().min(1),
    from: Joi.date(),
    to: Joi.date(),
  }
  return Joi.object().keys(schema);
};
export const ConfirmSetQuerySchema = ConfirmSetQuerySchemaFactory();