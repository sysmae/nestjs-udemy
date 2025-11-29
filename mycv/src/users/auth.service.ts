// auth.service.ts
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common'; // 예외 클래스 임포트
import { UsersService } from './users.service';
import { randomBytes, scrypt  as _scrypt} from 'crypto';
import { promisify } from 'util';

// scrypt를 Promise 버전으로 변환
const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string) {
    // 1. 이메일 중복 확인
    // usersService.find()는 Promise를 반환하므로 await 필수
    const users = await this.usersService.find(email);

    // 2. 결과 검증
    // find 메서드가 배열을 반환한다고 가정했을 때, 길이가 있다면 이미 존재하는 사용자임
    if (users.length > 0) {
      // 3. 예외 발생
      // 이 예외는 자동으로 NestJS에 의해 포착되어 400 에러 응답으로 변환됨
      throw new BadRequestException('email in use');
    }

    // 4. 비밀번호 해싱
    // salt 생성 8바이트의 무작위 데이터 생성 -> 16진수 문자열로 변환
    const salt = randomBytes(8).toString('hex');

    // hash 생성 비밀번호와 솔트를 결합하여 해싱 (키 길이 32바이트)
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    // 솔트 + 구분자(.) + 해시 결과
    const result = salt + '.' + hash.toString('hex');

    // 5. 사용자 생성 및 저장
    const user = await this.usersService.create(email, result);

    // 6. 생성된 사용자 반환
    return user;
  }

    async signin(email: string, password: string) {
        // 1. 사용자 존재 여부 확인
        const [user] = await this.usersService.find(email); // find는 배열을 반환한다고 가정
        if (!user) {
        throw new NotFoundException('user not found');
        }

        // 2. 저장된 비밀번호에서 솔트와 해시 분리
        // user.password 형식: "salt.storedHash"
        const [salt, storedHash] = user.password.split('.');

        // 3. 입력된 비밀번호를 추출한 솔트로 다시 해싱
        // 중요: signup 때와 동일한 키 길이(32)를 사용해야 함
        const hash = (await scrypt(password, salt, 32)) as Buffer;

        // 4. 비교 검증
        // 새로 만든 해시(Buffer)를 16진수 문자열로 변환하여 비교
        if (storedHash !== hash.toString('hex')) {
        throw new BadRequestException('bad password');
        }

        // 5. 검증 성공 시 사용자 반환
        return user;
    }
}