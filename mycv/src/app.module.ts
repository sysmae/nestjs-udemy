import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { User } from './users/user.entity';
import { Report } from './reports/report.entity';
import { APP_PIPE } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';

// 호환성을 위해 import 대신 require 사용 (cookie-session)
const cookieSession = require('cookie-session');

@Module({
  imports: [
    // 1. ConfigModule 설정: .env 파일을 로드하여 환경 변수 관리
    ConfigModule.forRoot({
      isGlobal: true, // 전역 모듈로 설정하여 어디서든 ConfigService 사용 가능
      envFilePath: `.env.${process.env.NODE_ENV}`, // NODE_ENV에 따라 .env.test 또는 .env.development 로드
    }),

    // 2. TypeOrmModule 비동기 설정 (ConfigService 주입 필요)
    TypeOrmModule.forRootAsync({
      inject: [ConfigService], // ConfigService를 주입받음
      useFactory: (config: ConfigService) => {
        return {
          type: 'sqlite',
          // 환경 변수에서 DB_NAME 값을 가져와 데이터베이스 파일 지정
          database: config.get<string>('DB_NAME'),
          entities: [User, Report],
          synchronize: true, // 개발 환경에서만 true 권장 (프로덕션에서는 마이그레이션 사용)
        };
      },
    }),
    UsersModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // 전역 파이프 설정 (ValidationPipe)
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true, // DTO에 정의되지 않은 속성 제거
      }),
    },
  ],
})
export class AppModule {
  // 3. 미들웨어 설정에서 ConfigService를 사용하기 위해 생성자 주입
  constructor(private configService: ConfigService) {}

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        cookieSession({
          // 환경 변수에서 COOKIE_KEY를 가져와 암호화 키로 사용
          keys: [this.configService.get('COOKIE_KEY')],
        }),
      )
      .forRoutes('*'); // 모든 라우트에 쿠키 세션 미들웨어 적용
  }
}
