import { Injectable } from '@nestjs/common';
import { readFile, writeFile } from "fs/promises";

/**
 * @Injectable: 리포지토리도 다른 곳(Service)에 주입되어야 하므로 Injectable로 표시합니다.
 * 
 * Repository: 데이터 저장소(파일, DB 등)에 직접 접근하는 역할을 합니다.
 * 데이터를 읽거나 쓰는 로우 레벨(low-level) 로직을 담당합니다.
 */
@Injectable()
export class MessagesRepository {
    async findOne(id: string) {
        const contents = await readFile("messages.json", { encoding: "utf8" });
        const messages = JSON.parse(contents);
        return messages[id];
    }

    async findAll() {
        const contents = await readFile("messages.json", { encoding: "utf8" });
        const messages = JSON.parse(contents);
        return messages;
    }

    async create(content: string) {
        const contents = await readFile("messages.json", { encoding: "utf8" });
        const messages = JSON.parse(contents);
        const id = Math.floor(Math.random() * 999);
        messages[id] = { id, content };
        await writeFile("messages.json", JSON.stringify(messages, null, 2));
        return messages[id];
    }

}