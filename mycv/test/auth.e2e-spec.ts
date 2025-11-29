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

  // [신규] 회원가입 후 내 정보 확인 시나리오
  it('signup as a new user then get the currently logged in user', async () => {
    const email = 'test@test.com';

    // 1. 회원가입 요청 (Signup)
    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: 'password' })
      .expect(201); // 생성 성공 확인

    // 2. 쿠키 추출 (Extract Cookie)
    // response.get('Set-Cookie')는 쿠키 문자열 배열을 반환함
    const cookie = res.get('Set-Cookie') || [];

    // 3. 내 정보 확인 요청 (WhoAmI)
    const { body } = await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie) // [중요] 쿠키를 헤더에 포함시켜 전송
      .expect(200); // 접근 성공 확인

    // 4. 검증 (Assertion)
    // 반환된 정보의 이메일이 가입한 이메일과 일치하는지 확인
    expect(body.email).toEqual(email);
  });
});
