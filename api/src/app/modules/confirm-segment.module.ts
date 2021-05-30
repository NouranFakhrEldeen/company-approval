/* eslint-disable @typescript-eslint/no-use-before-define */
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  ConfirmSegmentController,
} from '../controllers';
import { 
  ConfirmSetSegment,
  ConfirmSetSegmentItem,
  Segment,
} from '../entities';
import {
  ConfirmSegmentService,
  ConfirmSegmentItemService,
} from '../services';
import { ConfirmSetModule ,RoleModule } from './';
@Module({
  imports: [
    TypeOrmModule.forFeature([
        ConfirmSetSegment,
        ConfirmSetSegmentItem,
        Segment,
    ]),
    PassportModule.register({ defaultStrategy: 'jwt'}),
    RoleModule,
    ConfirmSetModule,
  ],
  providers: [
    ConfirmSegmentService,
    ConfirmSegmentItemService,
  ],
  controllers: [
    ConfirmSegmentController,
  ],
  exports: [
    ConfirmSegmentService,
    ConfirmSegmentItemService,
  ],
  
})
export class ConfirmSegmentModule {}