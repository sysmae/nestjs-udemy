import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

// 1. 호환성을 위해 require 문법 사용
const cookieSession = require('cookie-session');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({whitelist:true
  }));
  // 2. 전역 미들웨어로 등록
  app.use(cookieSession({
    // 3. 암호화 키 설정
    keys: ['mykey'],
    // 4. 쿠키의 유효 기간 (1일)
    maxAge: 24 * 60 * 60 * 1000,
  }));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
