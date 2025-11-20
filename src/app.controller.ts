import { Controller, Get } from "@nestjs/common";

// 전체 경로: /app/asdf
// @Controller('/app') 은 AppController의 기본 경로를 설정
// @Get('/asdf') 는 getRootRoute 메서드의 경로를 설정
@Controller('/app')
export class AppController {
    @Get('/asdf')
    getRootRoute() {
        return "Hello World!";
    }

    @Get('/bye')
    getByeRoute() {
        return "Goodbye World!";
    }
}
