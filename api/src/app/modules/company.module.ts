import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyController } from '../controllers';
import { Company } from '../entities';
import { CompanyService } from '../services';
import { RoleModule } from './role.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Company]),
    PassportModule.register({ defaultStrategy: 'jwt'}),
    RoleModule,
  ],
  providers: [
    CompanyService,
  ],
  controllers: [
    CompanyController,
  ],
  exports: [
    CompanyService,
  ]
})
export class CompanyModule {}