import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { PingController } from '../controllers';

@Module({
  imports:[
    PassportModule.register({ defaultStrategy: 'jwt'}),
  ],
  controllers: [PingController],
})
export class PingMoudle {}
