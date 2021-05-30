import { ApiProperty } from '@nestjs/swagger';
import * as Joi from '@hapi/joi';
import { ConfirmSegmentItemCreateDTO, ConfirmSegmentItemCreateSchema, IdSchema } from '.';
import { ConfirmSegmentTypeEnum } from '../enums';

export class ConfirmSegmentCreateDTO {
  @ApiProperty({ description: 'audit tool checklist id', required: true })
  checklistId: string;

  @ApiProperty({ description: 'main segment id', required: true })
  segmentId: string;

  @ApiProperty({ description: 'name', required: true })
  name: string;

  @ApiProperty({ description: `type "${Object.keys(ConfirmSegmentTypeEnum).join()}"`, enum: ConfirmSegmentTypeEnum,  required: true })
  type: ConfirmSegmentTypeEnum;

  @ApiProperty({ description: `city "allowed when type is ADDRESS or ROOM"`, required: false })
  city: string;

  @ApiProperty({ description: `postal code "allowed when type is ADDRESS or ROOM"`, required: false })
  postalCode: string;

  @ApiProperty({ description: `street "allowed when type is ADDRESS or ROOM"`, required: false })
  street: string;

  @ApiProperty({ description: `address alias "allowed when type is ADDRESS"`, required: false })
  addressAlias: string;

  @ApiProperty({ description: `room "allowed when type is ROOM"`, required: false })
  room: string;

  @ApiProperty({ description: 'items', type: [ConfirmSegmentItemCreateDTO], required: false })
  items: ConfirmSegmentItemCreateDTO[];

  status?: string;

}

const ConfirmSegmentCreateSchemaFactory = () => {
  const schema: any = {
    checklistId: Joi.string().required(),
    segmentId: IdSchema.required(),
    name: Joi.string().required(),
    type: Joi.string().valid(...Object.keys(ConfirmSegmentTypeEnum)).required(),
    items: Joi.array().items(ConfirmSegmentItemCreateSchema),
  }
  schema.city = Joi.string().when(
    'type',
    { is: ConfirmSegmentTypeEnum.ADDRESS, then: Joi.optional(), otherwise: Joi.when(
      'type',
      { is: ConfirmSegmentTypeEnum.ROOM, then: Joi.optional(), otherwise: Joi.forbidden() },
    )},
  );
  schema.postalCode = Joi.string().regex(/^\d{5}$/).when(
    'type',
    { is: ConfirmSegmentTypeEnum.ADDRESS, then: Joi.optional(), otherwise: Joi.when(
      'type',
      { is: ConfirmSegmentTypeEnum.ROOM, then: Joi.optional(), otherwise: Joi.forbidden() },
    )},
  );
  schema.street = Joi.string().when(
    'type',
    { is: ConfirmSegmentTypeEnum.ADDRESS, then: Joi.optional(), otherwise: Joi.when(
      'type',
      { is: ConfirmSegmentTypeEnum.ROOM, then: Joi.optional(), otherwise: Joi.forbidden() },
    )},
  );
  schema.addressAlias = Joi.string().when(
    'type',
    { is: ConfirmSegmentTypeEnum.ADDRESS, then: Joi.optional(), otherwise: Joi.forbidden() },
  );
  schema.room = Joi.string().when(
    'type',
    { is: ConfirmSegmentTypeEnum.ROOM, then: Joi.optional(), otherwise: Joi.forbidden() },
  );
  return Joi.object().keys(schema);
};
export const ConfirmSegmentCreateSchema = ConfirmSegmentCreateSchemaFactory();
