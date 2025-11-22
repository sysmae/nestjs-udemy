import { Controller, Get, Post, Body, Param, NotFoundException } from '@nestjs/common';
import { CreateMessageDto } from './dtos/create-message.dto';
import { MessagesService } from './messages.service';

/**
 * @Controller: 들어오는 요청을 처리하고 응답을 반환하는 역할을 합니다.
 * 'messages'는 이 컨트롤러가 처리할 기본 경로(prefix)입니다. (예: /messages)
 */
@Controller('messages')
export class MessagesController {
    /**
     * 의존성 주입 (Dependency Injection):
     * NestJS가 알아서 MessagesService의 인스턴스를 생성해서 이 생성자에 넣어줍니다.
     * 우리가 직접 'new MessagesService()'를 할 필요가 없습니다.
     * 'public' 키워드를 쓰면 자동으로 클래스의 속성(this.messagesService)으로 할당됩니다.
     */
    constructor(public messagesService: MessagesService) { }

    /**
     * @Get(): GET 요청을 처리합니다.
     * 메서드 이름(listMessages)은 자유롭게 지을 수 있습니다.
     */
    @Get()
    listMessages() {
        return this.messagesService.findAll();
    }

    /**
     * @Post(): POST 요청을 처리합니다.
     * @Body(): 요청 본문(Body)에 있는 데이터를 추출해서 body 변수에 담아줍니다.
     * CreateMessageDto: 데이터가 어떤 모양이어야 하는지 정의하고 검증하는 역할을 합니다.
     */
    @Post()
    createMessage(@Body() body: CreateMessageDto) {
        return this.messagesService.create(body.content);
    }

    /**
     * @Get(':id'): URL 파라미터(예: /messages/123)를 처리합니다.
     * @Param('id'): URL에서 'id' 부분의 값을 추출해서 id 변수에 담아줍니다.
     */
    @Get(':id')
    async getMessage(@Param('id') id: string) {
        const message = await this.messagesService.findOne(id);
        // 메시지가 없으면 NotFoundException을 던집니다.
        if (!message) {
            throw new NotFoundException('Message not found');
        }
        return message;
    }
}
