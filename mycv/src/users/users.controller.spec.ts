import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';

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
    // 1. 컨트롤러 메서드 호출
    const users = await controller.findAllUsers('test@test.com');

    // 2. 검증
    expect(users.length).toEqual(1); // 배열 길이가 1이어야 함
    expect(users[0].email).toEqual('test@test.com'); // 이메일이 일치해야 함
  });
});
