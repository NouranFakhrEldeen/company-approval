/* eslint-disable @typescript-eslint/no-use-before-define */
import { HttpModule, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  InternalContactController,
} from '../controllers';
import { 
  ConfirmSetContact,
} from '../entities';
import {
  InternalContactService,
} from '../services';
@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([ConfirmSetContact]),
    PassportModule.register({ defaultStrategy: 'basic-external'}),
  ],
  providers: [
    InternalContactService,
  ],
  controllers: [
    InternalContactController,
  ],
})
export class InternalContactModule {}