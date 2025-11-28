import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';
import { UserDto } from '../users/dtos/user.dto'; // UserDto 임포트

export class SerializeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    
    return next.handle().pipe(
      map((data: any) => {
        // 데이터가 응답으로 나가기 전 실행되는 영역
        
        return plainToClass(UserDto, data, {
          excludeExtraneousValues: true, // 핵심 설정!
        });
      }),
    );
  }
}