import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Injectable,
} from '@nestjs/common';
import { UsersService } from '../users.service';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  // 1. UsersService 주입 (DI 가능!)
  constructor(private usersService: UsersService) {}

  async intercept(context: ExecutionContext, handler: CallHandler) {
    // 2. 요청 객체 가져오기
    const request = context.switchToHttp().getRequest();

    // 3. 세션에서 userId 읽기
    const { userId } = request.session || {};

    // 4. userId가 있다면 DB에서 사용자 조회
    if (userId) {
      const user = await this.usersService.findOne(userId);

      // 5. [핵심] 찾은 유저 정보를 request 객체에 'currentUser'라는 이름으로 부착
      // 이제 이 request 객체는 컨트롤러와 데코레이터로 전달됩니다.
      request.currentUser = user;
    }

    // 6. 다음 핸들러 실행
    return handler.handle();
  }
}
