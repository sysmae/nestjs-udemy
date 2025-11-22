import { Injectable } from '@nestjs/common';
import { MessagesRepository } from "./messages.repository";

/**
 * @Injectable: 이 클래스를 NestJS의 DI 컨테이너가 관리할 수 있게 해줍니다.
 * 다른 곳(예: Controller)에서 이 서비스를 필요로 할 때 주입받을 수 있습니다.
 * 
 * Service: 비즈니스 로직을 담당합니다. 
 * 데이터베이스에 직접 접근하기보다는 Repository를 사용해서 데이터를 다룹니다.
 */
@Injectable()
export class MessagesService {
    /**
     * MessagesRepository를 주입받습니다.
     * 서비스는 리포지토리를 통해 데이터를 저장하거나 가져옵니다.
     */
    constructor(public messagesRepo: MessagesRepository) { }

    async findOne(id: string) {
        return this.messagesRepo.findOne(id);
    }

    async findAll() {
        return this.messagesRepo.findAll();
    }

    async create(content: string) {
        return this.messagesRepo.create(content);
    }
}