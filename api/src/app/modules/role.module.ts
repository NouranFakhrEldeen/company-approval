import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleController } from '../controllers';
import { Role } from '../entities';
import { RoleService } from '../services';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role]),
    PassportModule.register({ defaultStrategy: 'jwt'}),
  ],
  providers: [
    RoleService,
  ],
  controllers: [
    RoleController,
  ],
  exports: [
    RoleService,
  ]
})
export class RoleModule {}