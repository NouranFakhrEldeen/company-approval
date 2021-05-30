/* eslint-disable @typescript-eslint/no-use-before-define */
import { forwardRef, HttpModule, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  InternalSyncController,
} from '../controllers';
import { 
  Company,
  ConfirmSet,
  ConfirmSetSegment,
  ConfirmSetSegmentItem,
  Deviation,
  Metadata,
} from '../entities';
import {
  CompanyService,
  InternalSyncService,
} from '../services';
import { SegmentModule } from './';
@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([
      Deviation,
      ConfirmSet,
      ConfirmSetSegmentItem,
      ConfirmSetSegment,
      Company,
      Metadata,
    ]),
    forwardRef(() => SegmentModule),
    PassportModule.register({ defaultStrategy: 'basic-internal'}),
  ],
  providers: [
    InternalSyncService,
    CompanyService,
  ],
  controllers: [
    InternalSyncController,
  ],
  exports: [
    InternalSyncService,
  ]
})
export class InternalSyncModule {}