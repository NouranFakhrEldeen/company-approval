import { ApiProperty } from '@nestjs/swagger';
import * as Joi from '@hapi/joi';
import { ConfirmSegmentTypeEnum, SegmentStatusUpdateEnum } from '../enums';

export class ConfirmSegmentUpdateDTO {
  @ApiProperty({ description: 'name', required: false })
  name?: string;

  @ApiProperty({ description: `type "${Object.keys(SegmentStatusUpdateEnum).join()}"`, enum: SegmentStatusUpdateEnum,  required: false })
  status?: SegmentStatusUpdateEnum;

  @ApiProperty({ description: `type "${Object.keys(ConfirmSegmentTypeEnum).join()}"`, enum: ConfirmSegmentTypeEnum, required: false })
  type?: ConfirmSegmentTypeEnum;

  @ApiProperty({ description: `city "allowed when type is ADDRESS or ROOM"`, required: false })
  city?: string;

  @ApiProperty({ description: `postal code "allowed when type is ADDRESS or ROOM"`, required: false })
  postalCode?: string;

  @ApiProperty({ description: `street "allowed when type is ADDRESS or ROOM"`, required: false })
  street?: string;

  @ApiProperty({ description: `address alias "allowed when type is ADDRESS"`, required: false })
  addressAlias?: string;

  @ApiProperty({ description: `room "allowed when type is ROOM"`, required: false })
  room?: string;

  @ApiProperty({ description: ``, required: false })
  feedback?: string;
}

const ConfirmSegmentUpdateSchemaFactory = () => {
  const schema: any = {
    name: Joi.string(),
    status: Joi.string().valid(...Object.keys(SegmentStatusUpdateEnum)),
    type: Joi.string().valid(...Object.keys(ConfirmSegmentTypeEnum)),
  }
  schema.feedback = Joi.string().when(
    'status',
    {
      is: SegmentStatusUpdateEnum.RETURNED, then: Joi.optional(), otherwise: Joi.forbidden()
    },
  );
  schema.city = Joi.string().when(
    'type',
    {
      is: ConfirmSegmentTypeEnum.ADDRESS, then: Joi.required(), otherwise: Joi.when(
        'type',
        { is: ConfirmSegmentTypeEnum.ROOM, then: Joi.required(), otherwise: Joi.forbidden() },
      )
    },
  );
  schema.postalCode = Joi.string().regex(/^\d{5}$/).when(
    'type',
    {
      is: ConfirmSegmentTypeEnum.ADDRESS, then: Joi.required(), otherwise: Joi.when(
        'type',
        { is: ConfirmSegmentTypeEnum.ROOM, then: Joi.required(), otherwise: Joi.forbidden() },
      )
    },
  );
  schema.street = Joi.string().when(
    'type',
    {
      is: ConfirmSegmentTypeEnum.ADDRESS, then: Joi.required(), otherwise: Joi.when(
        'type',
        { is: ConfirmSegmentTypeEnum.ROOM, then: Joi.required(), otherwise: Joi.forbidden() },
      )
    },
  );
  schema.addressAlias = Joi.string().when(
    'type',
    { is: ConfirmSegmentTypeEnum.ADDRESS, then: Joi.optional(), otherwise: Joi.forbidden() },
  );
  schema.room = Joi.string().when(
    'type',
    { is: ConfirmSegmentTypeEnum.ROOM, then: Joi.required(), otherwise: Joi.forbidden() },
  );
  return Joi.object().keys(schema);
};
export const ConfirmSegmentUpdateSchema = ConfirmSegmentUpdateSchemaFactory();
