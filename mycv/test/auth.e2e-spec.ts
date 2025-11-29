import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest'; // * as request가 아님에 주의
import { AppModule } from './../src/app.module';

describe('Authentication System', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles a signup request', () => {
    const email = 'test@test.com'; // 변수로 추출하여 검증에 재사용

    return request(app.getHttpServer())
      .post('/auth/signup') // 1. POST 요청 전송
      .send({
        // 2. Body 데이터 전송
        email: email,
        password: 'password',
      })
      .expect(201) // 3. 201 Created 기대
      .then((res) => {
        // 4. 응답 본문 검증
        const { id, email } = res.body;
        expect(id).toBeDefined(); // ID가 생성되었는지
        expect(email).toEqual(email); // 이메일이 일치하는지
      });
  });
});
