import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;

  // 1. 가짜 서비스 변수 선언 (Partial 타입 활용)
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    // 2. 가짜 객체 스켈레톤 정의
    // 컨트롤러가 실제로 호출하는 메서드만 빈 껍데기로 만들어둡니다.
    fakeUsersService = {
      // 1. findOne: 특정 ID의 유저 반환 시뮬레이션
      findOne: (id: number) => {
        return Promise.resolve({
          id,
          email: 'test@test.com',
          password: 'hashed_password',
        } as User);
      },

      // 2. find: 이메일 검색 결과(배열) 반환 시뮬레이션
      find: (email: string) => {
        return Promise.resolve([
          {
            id: 1,
            email,
            password: 'hashed_password',
          } as User,
        ]);
      },
      remove: (id: number) =>
        Promise.resolve({
          id,
          email: 'test@test.com',
          password: 'hash',
        } as User),
      update: (id: number, attrs: Partial<User>) =>
        Promise.resolve({
          id,
          email: 'test@test.com',
          password: 'hash',
          ...attrs,
        } as User),
    };

    fakeAuthService = {
      signup: (email: string, password: string) =>
        Promise.resolve({ id: 1, email, password } as User),
      signin: (email: string, password: string) =>
        Promise.resolve({ id: 1, email, password } as User),
    };

    // 3. 테스트 모듈 생성 (DI 설정)
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService, // 가짜 주입
        },
        {
          provide: AuthService,
          useValue: fakeAuthService, // 가짜 주입
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // 특정 사용자 조회 테스트
  it('findUser returns a single user with the given id', async () => {
    // 1. 컨트롤러 메서드 호출 (문자열 '1'을 넘긴다고 가정 - 실제 HTTP 요청에선 문자열로 오므로)
    // 주의: 컨트롤러 구현에 따라 id를 number로 받을 수도, string으로 받을 수도 있음.
    // 여기서는 컨트롤러가 파싱된 number를 받는다고 가정하거나, 문자열을 넘김.
    const user = await controller.findUser('1');

    // 2. 검증
    expect(user).toBeDefined();
    expect(user.id).toEqual(1); // Mock이 입력받은 ID를 그대로 돌려주기로 했으므로 1이어야 함
  });

  // 이메일 검색 테스트
  it('findAllUsers returns a list of users with the given email', async () => {
    // 1. Act: 컨트롤러 메서드 호출
    const users = await controller.findAllUsers('asdf@asdf.com');

    // 2. Assert: 검증
    // beforeEach에서 설정한 fakeUsersService.find는 항상 1개의 유저를 반환하도록 되어 있음
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('asdf@asdf.com'); // Mock이 입력받은 이메일을 그대로 돌려주기로 약속했으므로
  });

  it('findUser throws an error if user with given id is not found', async () => {
    // 1. Mock 재정의: 사용자를 찾지 못하는 상황 연출
    fakeUsersService.findOne = (id: number) => {
      return Promise.resolve(null); // null 반환 = 유저 없음
    };

    // 2. 검증: 컨트롤러 호출 시 NotFoundException 발생 확인
    await expect(controller.findUser('1')).rejects.toThrow(NotFoundException);
  });

  // [신규] 로그인 시 세션 업데이트 검증 테스트
  it('signin updates session object and returns user', async () => {
    // 1. Arrange (준비)
    // 세션 객체 초기화: 변경 여부를 확실히 알기 위해 엉뚱한 값(-10)을 넣어둠
    const session: any = { userId: -10 };
    const body = { email: 'test@test.com', password: 'password' };

    // 2. Act (실행)
    // 컨트롤러에 body와 session 객체(참조)를 전달
    const user = await controller.signin(body, session);

    // 3. Assert (검증)

    // 검증 A: 반환된 유저의 ID가 Mock이 준 1과 같은가?
    expect(user.id).toEqual(1);

    // 검증 B: 세션 객체의 userId가 -10에서 1로 변경되었는가? (핵심!)
    expect(session.userId).toEqual(1);
  });
});
