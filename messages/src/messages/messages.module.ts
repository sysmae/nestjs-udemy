import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { MessagesRepository } from './messages.repository';

/**
 * @Module: 앱의 구성 요소를 묶어주는 역할입니다.
 * NestJS는 이 모듈을 보고 어떤 컨트롤러와 서비스가 있는지 파악하고,
 * 서로 어떻게 연결(의존성 주입)해야 하는지 알 수 있습니다.
 */
@Module({
  // controllers: 이 모듈에서 사용하는 컨트롤러들을 등록합니다. (요청 처리 담당)
  controllers: [MessagesController],
  // providers: 이 모듈에서 사용하는 서비스나 리포지토리 등을 등록합니다. (비즈니스 로직, 데이터 접근 담당)
  // 여기에 등록되어야 NestJS의 DI(의존성 주입) 컨테이너가 이 클래스들을 관리하고 다른 곳에 주입해줄 수 있습니다.
  providers: [MessagesService, MessagesRepository]
})
export class MessagesModule { }
