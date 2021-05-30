
import { BasicStrategy } from 'passport-http';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class BasicInternalStrategy extends PassportStrategy(BasicStrategy, 'basic-internal') {
  async validate(username: string, password: string): Promise<any> {
    const exist =  process.env.INTERNAL_BASIC_AUTH_USER &&
    process.env.INTERNAL_BASIC_AUTH_USER === username &&
    process.env.INTERNAL_BASIC_AUTH_PASSWORD &&
    process.env.INTERNAL_BASIC_AUTH_PASSWORD === password;
    if (!exist) {
      throw new UnauthorizedException();
    }
    return exist;
  }
}