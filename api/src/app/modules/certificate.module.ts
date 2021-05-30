/* eslint-disable @typescript-eslint/no-use-before-define */
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  CertificateController,
} from '../controllers';
import { 
  Certificate,
} from '../entities';
import {
  CertificateService,
} from '../services';
import { ConfirmSetModule ,RoleModule } from '.';
import { CompanyModule } from './company.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Certificate,
    ]),
    PassportModule.register({ defaultStrategy: 'jwt'}),
    RoleModule,
    ConfirmSetModule,
    CompanyModule,
  ],
  providers: [
    CertificateService,
  ],
  controllers: [
    CertificateController,
  ],
})
export class CertificateModule {}