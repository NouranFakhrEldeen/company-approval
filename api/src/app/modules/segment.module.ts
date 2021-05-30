import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { 
  SegmentController,
} from '../controllers';
import { 
  Segment,
  SegmentItem,
} from '../entities';
import {
  SegmentService,
  SegmentItemService,
} from '../services';
import { RoleModule } from './role.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Segment,
      SegmentItem,
    ]),
    PassportModule.register({ defaultStrategy: 'jwt'}),
    RoleModule,
  ],
  providers: [
    SegmentService,
    SegmentItemService,
  ],
  controllers: [
    SegmentController,
  ],
  exports: [
    SegmentService,
    SegmentItemService,
  ]
})
export class SegmentModule {}