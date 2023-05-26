import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app.module';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn'],
  });
  app.enableCors();
  const config = new DocumentBuilder()
    .setTitle('Backend API description')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  // http://localhost:8000/api でswaggerに接続可能
  SwaggerModule.setup('api', app, document);
  await app.listen(8000);
}
bootstrap();
