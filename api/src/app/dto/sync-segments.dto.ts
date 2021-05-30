

import { ApiProperty } from '@nestjs/swagger';
import * as Joi from '@hapi/joi';
import { MongoIdSchema } from './';
import { SegmentCreateDTO, SegmentCreateSchema } from './segment-create.dto';

export class SyncSegmentsDTO {
  @ApiProperty({ description: 'array of created segments', type:[SegmentCreateDTO], required: false })
  created: SegmentCreateDTO[];

  @ApiProperty({ description: 'array of updated segments', type:[SegmentCreateDTO], required: false })
  updated: SegmentCreateDTO[];

  @ApiProperty({ description: 'array of removed segments id', required: false })
  removed: string[];

  @ApiProperty({ description: 'the owner of these records', required: true })
  owner: string;

  @ApiProperty({ description: 'the creator email', required: true })
  creator: string;
}

const SyncSegmentsSchemaFactory = () => {
  const schema: any = {
    created: Joi.array().items(SegmentCreateSchema),
    updated: Joi.array().items(SegmentCreateSchema),
    removed: Joi.array().items(MongoIdSchema),
    owner: Joi.string().required(),
    creator: Joi.string().email({minDomainSegments: 2, tlds: {allow: false}}).required(),
  }
  return Joi.object().keys(schema);
};
export const SyncSegmentsSchema = SyncSegmentsSchemaFactory();
