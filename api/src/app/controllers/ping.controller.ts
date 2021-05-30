import { Controller, Get, UseGuards} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Ping')
@ApiBearerAuth()
@Controller('')
export class PingController {
    @Get()
    @UseGuards(AuthGuard())
    async get(): Promise<any> {
        return;
    }

}