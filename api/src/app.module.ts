import { Module } from '@nestjs/common';

import { DatabaseModule } from './infrastructure';
import { AuthModule } from './app/auth';

import {
  RoutingModule,
} from './app/modules';

@Module({
  imports: [
    RoutingModule,
    AuthModule,
    DatabaseModule,
  ],
  exports: [
    DatabaseModule,
  ]
})
export class AppModule {}
