import { createParamDecorator } from '@nestjs/common';

export const ImageStorage = createParamDecorator((data: string) => {
    return process.env.IMAGE_STORAGE || data || 'local';
});
