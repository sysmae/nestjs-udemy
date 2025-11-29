import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity'; // User 엔터티 임포트 필수

describe('AuthService', () => {
  let service: AuthService;

  // 1. Partial 타입을 사용하여 타입 안전성 확보
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    // 2. 가짜 객체 구현
    fakeUsersService = {
      find: (email: string) => {
        return Promise.resolve([]); // 빈 배열(중복 없음) 반환
      },
      create: (email: string, password: string) => {
        // 3. 'as User'를 사용하여 엔터티 메서드 구현 강제 무시
        return Promise.resolve({ id: 1, email, password } as User);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });
});
