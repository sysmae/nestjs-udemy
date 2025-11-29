import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// 커스텀 데코레이터 생성
export const CurrentUser = createParamDecorator(
  (data: any, context: ExecutionContext) => {
    // 1. data: 데코레이터에 넘겨진 인자 (예: @CurrentUser('id') 일 때 'id')
    // 2. context: 요청에 대한 모든 정보(HTTP, WebSocket 등)를 담은 래퍼

    // 여기에서 반환하는 값이 컨트롤러의 파라미터로 들어간다.
    
    return 'hi there';
  },
);