import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity'; // User 엔터티 임포트 필수
import { BadRequestException, NotFoundException } from '@nestjs/common';

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

  it('creates a new user with a salted and hashed password', async () => {
    // 1. Given: 입력 데이터 준비
    const email = 'test@test.com';
    const password = 'asdf'; // 평문 비밀번호

    // 2. When: 회원가입 메서드 실행
    const user = await service.signup(email, password);

    // 3. Then: 검증

    // 검증 A: 비밀번호가 평문 그대로 저장되지 않았는지 확인 (보안 필수)
    expect(user.password).not.toEqual(password);

    // 검증 B: 'salt.hash' 형식인지 확인
    const [salt, hash] = user.password.split('.');

    // 의도적으로 에러를 내기 위해 코드를 수정
    // const [salt, hash] = user.password.split('$'); // '.' 대신 '$' 사용

    // 솔트와 해시가 모두 존재해야 함
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    // 3. [핵심] 이 테스트 안에서만 find 메서드 재정의 (실패 케이스용)
    fakeUsersService.find = (email) =>
      Promise.resolve([{ id: 1, email, password: 'pw' } as User]);

    // 이제 signup을 호출하면 find가 위의 함수를 실행하여 에러를 유발함
    await expect(service.signup('test@test.com', 'asdf')).rejects.toThrow(
      BadRequestException,
    );
  });

  // [신규] 로그인 실패 테스트 (존재하지 않는 이메일)
  it('throws if signin is called with an unused email', async () => {
    // 1. 시나리오: 가입되지 않은 이메일로 로그인 시도
    // fakeUsersService.find는 기본적으로 빈 배열([])을 반환하므로
    // 별도의 설정 없이 바로 호출하면 "사용자 없음" 상황이 연출됨.

    // 2. 검증: NotFoundException이 발생하는지 확인
    // Jest의 .rejects.toThrow() 매처를 사용하여 간결하게 검증
    await expect(
      service.signin('asdflkj@asdlfkj.com', 'passdflkj'),
    ).rejects.toThrow(NotFoundException);
  });

  // [신규/수정] 비밀번호 불일치 시 에러 발생 테스트
  it('throws if an invalid password is provided', async () => {
    // 1. Mock 재정의: 사용자가 존재하는 상황 연출
    // DB에 'laskdjf'라는 해시된 비밀번호를 가진 유저가 있다고 가정한다.
    fakeUsersService.find = () =>
      Promise.resolve([
        { email: 'asdf@asdf.com', password: 'laskdjf' } as User,
      ]);

    // 2. 검증: 틀린 비밀번호 입력 시 BadRequestException 발생 확인
    // 입력한 비밀번호('passowrd')와 저장된 비밀번호('laskdjf')가 다르므로 에러가 나야 한다.
    await expect(
      service.signin('laskdjf@alskdfj.com', 'passowrd'),
    ).rejects.toThrow(BadRequestException);
  });

  // 임시 테스트 (나중에 삭제)
  it('logs a valid hashed password', async () => {
    // signup 메서드는 실제 scrypt를 돌려서 유효한 해시를 생성함
    const user = await service.signup('test@test.com', 'mypassword');
    console.log(user.password); // 콘솔에 찍힌 값을 복사한다!
  });

  it('returns a user if correct password is provided', async () => {
    // 1. Given: 복사한 해시값 준비
    const correctPassword = 'mypassword';
    // (예시) 실제로는 콘솔에서 복사한 값을 넣어야 함
    const validHash =
      '0ac2a7c295d2cdfe.d6eaddab136cb0a281cde16b41e57f101bebe988bef1e7bbcb0a9651a746ed9e';

    // 2. Mock 재정의: 유효한 해시를 가진 유저 반환
    fakeUsersService.find = (email) =>
      Promise.resolve([
        {
          id: 1,
          email,
          password: validHash, // [중요] 여기에 복사한 값을 붙여넣기
        } as User,
      ]);

    // 3. When: 올바른 비밀번호로 로그인 시도
    const user = await service.signin('test@test.com', correctPassword);

    // 4. Then: 유저 객체가 반환되어야 함 (성공)
    expect(user).toBeDefined();
  });
});
