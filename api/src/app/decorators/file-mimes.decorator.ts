import { createParamDecorator } from '@nestjs/common';

export const FileMimes = createParamDecorator((data: string[]) => {
    return process.env.mimes ? JSON.parse(process.env.mimes) : data;
});
