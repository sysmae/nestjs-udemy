import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// 커스텀 데코레이터 생성
export const CurrentUser = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    console.log(request.session.userId);

    return 'hi there';
  },
);
