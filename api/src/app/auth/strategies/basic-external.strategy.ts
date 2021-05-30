
import { BasicStrategy } from 'passport-http';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class BasicExternalStrategy extends PassportStrategy(BasicStrategy, 'basic-external') {
  async validate(username: string, password: string): Promise<any> {
    const exist =  process.env.EXTERNAL_BASIC_AUTH_USER &&
    process.env.EXTERNAL_BASIC_AUTH_USER === username &&
    process.env.EXTERNAL_BASIC_AUTH_PASSWORD &&
    process.env.EXTERNAL_BASIC_AUTH_PASSWORD === password;
    if (!exist) {
      throw new UnauthorizedException();
    }
    return exist;
  }
}