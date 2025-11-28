import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';


export function Serialize(dto: any) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    
    return next.handle().pipe(
      map((data: any) => {
        // 데이터가 응답으로 나가기 전 실행되는 영역
        
        return plainToClass(this.dto, data, {
          excludeExtraneousValues: true, // 핵심 설정!
        });
      }),
    );
  }
}