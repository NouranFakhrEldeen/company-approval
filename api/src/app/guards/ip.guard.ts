
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class IPGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const trustedIps = this.reflector.get<string[]>('ips', context.getHandler());
    if (!trustedIps) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const requestIP = request.ip || request.connection.remoteAddress;
    return trustedIps.indexOf(requestIP) >= 0;
  }
}
