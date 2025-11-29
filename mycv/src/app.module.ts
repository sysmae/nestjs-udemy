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
// 호환성을 위해 require 사용 권장
const cookieSession = require('cookie-session');

@Module({
  imports: [
    // 1. ConfigModule 설정: .env 파일 로드
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    UsersModule,
    ReportsModule,
    // 2. TypeOrmModule 비동기 설정 (forRootAsync)
    TypeOrmModule.forRootAsync({
      inject: [ConfigService], // ConfigService 주입 요청
      useFactory: (config: ConfigService) => {
        return {
          type: 'sqlite',
          // 환경 변수에서 DB 이름 가져오기 (db.sqlite 또는 test.sqlite)
          database: config.get<string>('DB_NAME'),
          entities: [User, Report],
          synchronize: true,
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
  ],
})
export class AppModule {
  // 3. 미들웨어 설정에 ConfigService를 사용하기 위해 생성자 주입
  constructor(private configService: ConfigService) {}

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        cookieSession({
          // 환경 변수에서 쿠키 암호화 키 가져오기
          keys: [this.configService.get('COOKIE_KEY')],
        }),
      )
      .forRoutes('*');
  }
}
