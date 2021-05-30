import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { BasicExternalStrategy } from './strategies/basic-external.strategy';
import { BasicInternalStrategy } from './strategies/basic-internal.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
    providers: [AuthService, JwtStrategy, BasicInternalStrategy, BasicExternalStrategy],
    exports: [AuthService, JwtStrategy, BasicInternalStrategy, BasicExternalStrategy],
})
export class AuthModule {}
