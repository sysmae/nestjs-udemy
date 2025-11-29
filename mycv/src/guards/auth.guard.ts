import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  // CanActivate 인터페이스 구현 필수
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // 1. 실행 컨텍스트에서 Request 객체 추출
    const request = context.switchToHttp().getRequest();

    // 2. 세션에서 userId 확인
    // request.session.userId가 있으면(Truthy) -> true 반환 -> 통과
    // 없거나 null/undefined면(Falsy) -> false 반환 -> 403 Forbidden
    return request.session.userId;
  }
}
