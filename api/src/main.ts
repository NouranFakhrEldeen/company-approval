import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

import { config, allowDevMode, LoggerService } from './infrastructure';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    {
      cors: process.env.CORS_ORIGINS ? {
        origin: process.env.CORS_ORIGINS.split(','),
        allowedHeaders: 'Authorization,Content-Type',
      } : true,
    },
  );
  app.useLogger(new LoggerService());
  app.setGlobalPrefix(process.env.BASE_ROUTE || 'api/v1');
  allowDevMode(app);
  const port = process.env.PORT || config.server.port;
  await app.listen(port);
}
bootstrap();
