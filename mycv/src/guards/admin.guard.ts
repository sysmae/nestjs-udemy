import { CanActivate, ExecutionContext } from '@nestjs/common';

export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    // 1. 유저가 없으면 거부 (로그인 안 함)
    if (!request.currentUser) {
      return false;
    }

    // 2. 유저가 관리자면 통과(true), 아니면 거부(false)
    return request.currentUser.admin;
  }
}
