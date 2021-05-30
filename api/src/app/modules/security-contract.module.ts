import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SecurityContractController } from '../controllers';
import { SecurityContract } from '../entities';
import { SecurityContractService } from '../services';
import { RoleModule } from './role.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SecurityContract]),
    PassportModule.register({ defaultStrategy: 'jwt'}),
    RoleModule,
  ],
  providers: [
    SecurityContractService,
  ],
  controllers: [
    SecurityContractController
  ],
})
export class SecurityContractModule {}