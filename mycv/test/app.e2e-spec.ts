import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest'; // * as request 이슈 주의 (이전 단계 참조)
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    // 1. 실제 AppModule을 가져와서 모듈 생성
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    // 2. Nest 애플리케이션 인스턴스 생성
    app = moduleFixture.createNestApplication();

    // 3. 앱 초기화 (서버 구동 준비)
    await app.init();
  });

  // 4. 테스트 시나리오
  it('/ (GET)', () => {
    // 5. HTTP 요청 전송 및 검증
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});
