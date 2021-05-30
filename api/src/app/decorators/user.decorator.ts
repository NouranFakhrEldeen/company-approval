import { createParamDecorator } from '@nestjs/common';

export const User = createParamDecorator((data: string, req) => {
    const user = JSON.parse(JSON.stringify(req.user));
    return data ? user && user[data] : user;
});
