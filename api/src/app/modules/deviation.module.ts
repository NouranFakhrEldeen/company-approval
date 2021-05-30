/* eslint-disable @typescript-eslint/no-use-before-define */
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyModule, RoleModule } from '.';
import {
  DeviationController,
} from '../controllers';
import { 
  Certificate,
  ConfirmSet, ConfirmSetSegment, ConfirmSetSegmentItem, Deviation, DeviationFeedbackHistory, Segment,
} from '../entities';
import {
  CertificateService,
  ConfirmSegmentItemService,
  ConfirmSegmentService,
  ConfirmSetService,
  DeviationService,
  SmtpServers,
} from '../services';
import { NodeMailerService } from '../smtp-servers/nodemailer.service';
import { InternalSyncModule } from './internal-sync.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      DeviationFeedbackHistory,
      ConfirmSet,
      ConfirmSetSegment,
      ConfirmSetSegmentItem,
      Segment,
      Certificate,
      Deviation,
    ]),
    PassportModule.register({ defaultStrategy: 'jwt'}),
    RoleModule,
    CompanyModule,
    InternalSyncModule,
  ],
  providers: [
    ConfirmSetService,
    ConfirmSegmentService,
    ConfirmSegmentItemService,
    CertificateService,
    DeviationService,
    SmtpServers,
    NodeMailerService,
  ],
  controllers: [
    DeviationController,
  ],
  exports: [
    DeviationService,
  ]
})
export class DeviationModule {}