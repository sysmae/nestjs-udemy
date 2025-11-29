import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
// * Node.js 내장 모듈 사용 시 import 방식 주의 *
// import * as fs from 'fs'; (X) -> 보통 E2E 설정 파일 충돌 가능성 있음
// 가장 안전한 방법은 require를 쓰거나 import 문법을 맞추는 것임.

describe('Authentication System', () => {
  let app: INestApplication;

  beforeEach(async () => {
    // [1. DB 삭제 로직 추가]
    // 테스트용 DB 파일이 존재하면 삭제하여 초기화한다.
    const fs = require('fs');
    if (fs.existsSync('test.sqlite')) {
      fs.unlinkSync('test.sqlite');
    }

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles a signup request', () => {
    const email = 'test' + Math.random() + '@test.com'; // 변수로 추출하여 검증에 재사용

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
