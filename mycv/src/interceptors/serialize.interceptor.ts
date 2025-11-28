import { UseInterceptors, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { plainToClass } from "class-transformer";

export class SerializeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // [Phase 1] 요청이 핸들러에 도달하기 전 실행
    console.log('Im running before the handler', context);

    return next.handle().pipe(
      map((data: any) => {
        // [Phase 2] 응답이 클라이언트로 전송되기 전 실행
        console.log('Im running before response is sent out', data);
        
        // 여기에 직렬화 로직이 들어갈 예정 (ex: plainToClass)
        return data; 
      }),
    );
  }
}