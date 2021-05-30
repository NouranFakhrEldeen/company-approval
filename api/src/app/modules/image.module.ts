/* eslint-disable @typescript-eslint/no-use-before-define */
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  ImageController,
} from '../controllers';
import { 
  Image,
} from '../entities';
import {
  ImageService,
} from '../services';
import { ConfirmSetModule ,RoleModule } from '.';
import { CompanyModule } from './company.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Image,
    ]),
    PassportModule.register({ defaultStrategy: 'jwt'}),
    RoleModule,
    ConfirmSetModule,
    CompanyModule,
  ],
  providers: [
    ImageService,
  ],
  controllers: [
    ImageController,
  ],
})
export class ImageModule {}