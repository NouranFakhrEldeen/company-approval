import { SetMetadata } from '@nestjs/common';

export const IPs = (...ips: string[]) => SetMetadata('ips', ips.length ? ips : undefined);
