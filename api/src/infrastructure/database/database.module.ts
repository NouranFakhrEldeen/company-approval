import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from '../'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: process.env.DB_HOST || config.db.host,
      port: parseInt(process.env.DB_PORT || '0') || config.db.port,
      database: process.env.DB_NAME || config.db.database,
      username: process.env.DB_USERNAME || config.db.username,
      password: process.env.DB_PASSWORD || config.db.password,
      entities: ['dist/**/**/*.entity{.js,.ts}'],
      connectionTimeout: 60 * 1000,
      synchronize: true,
      options: {
        encrypt: true,
        enableArithAbort: true
      },
    })
  ],
})
export class DatabaseModule { }