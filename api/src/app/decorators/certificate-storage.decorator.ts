import { createParamDecorator } from '@nestjs/common';

export const CertificateStorage = createParamDecorator((data: string) => {
    return process.env.CERTIFICATE_STORAGE || data || 'local';
});
