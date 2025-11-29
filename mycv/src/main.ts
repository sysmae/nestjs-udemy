// src/main.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.use(...) <-- 삭제됨
  // app.useGlobalPipes(...) <-- 삭제됨
  await app.listen(3000);
}
bootstrap();
