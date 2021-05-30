/* eslint-disable @typescript-eslint/no-use-before-define */
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  ConfirmContactController,
} from '../controllers';
import { 
  ConfirmSetContact,
} from '../entities';
import {
  ConfirmContactService, SmtpServers,
} from '../services';
import { NodeMailerService } from '../smtp-servers/nodemailer.service';
import { ConfirmSetModule ,RoleModule } from './';
@Module({
  imports: [
    TypeOrmModule.forFeature([
        ConfirmSetContact,
    ]),
    PassportModule.register({ defaultStrategy: 'jwt'}),
    RoleModule,
    ConfirmSetModule,
  ],
  providers: [
    ConfirmContactService,
    SmtpServers,
    NodeMailerService,
  ],
  controllers: [
    ConfirmContactController,
  ],
})
export class ConfirmContactModule {}