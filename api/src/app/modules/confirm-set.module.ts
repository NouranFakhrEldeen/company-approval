/* eslint-disable @typescript-eslint/no-use-before-define */
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyModule, RoleModule } from '.';
import {
  ConfirmSetController,
} from '../controllers';
import { 
  Certificate,
  ConfirmSet, ConfirmSetSegment, ConfirmSetSegmentItem, Deviation, Segment,
} from '../entities';
import {
  CertificateService,
  ConfirmSegmentItemService,
  ConfirmSegmentService,
  ConfirmSetService,
  SmtpServers,
} from '../services';
import { NodeMailerService } from '../smtp-servers/nodemailer.service';
import { InternalSyncModule } from './internal-sync.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([
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
    SmtpServers,
    NodeMailerService,
  ],
  controllers: [
    ConfirmSetController,
  ],
  exports: [
    ConfirmSetService,
    SmtpServers,
    NodeMailerService,
  ]
})
export class ConfirmSetModule {}