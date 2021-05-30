import { Injectable, CanActivate } from '@nestjs/common';

@Injectable()
export class ModeGuard implements CanActivate {
  activated = true;
  constructor(activate: boolean) {
    this.activated = activate;
  }

  canActivate(): boolean {
    return this.activated;
  }
}
