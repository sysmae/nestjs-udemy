import {
  Body,
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Query,
  NotFoundException,
  Session,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { CurrentUser } from './decorators/current-user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Get('/whoami')
  @UseGuards(AuthGuard)
  whoAmI(@CurrentUser() user: User) {
    return user;
  }

  @Post('/signout')
  @UseGuards(AuthGuard)
  signOut(@Session() session: any) {
    session.userId = null;
  }

  // 1. 회원가입 핸들러
  @Post('/signup')
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    // AuthService 호출 (비동기)
    const user = await this.authService.signup(body.email, body.password);

    // 핵심: 세션에 사용자 ID 저장
    session.userId = user.id;

    // 사용자 정보 반환
    return user;
  }

  // 2. 로그인 핸들러
  @Post('/signin')
  async signin(@Body() body: CreateUserDto, @Session() session: any) {
    // AuthService 호출 (비동기)
    const user = await this.authService.signin(body.email, body.password);

    // 핵심: 세션에 사용자 ID 저장
    session.userId = user.id;

    // 사용자 정보 반환
    return user;
  }

  // 1. 와일드카드(:id)를 사용하여 경로 설정
  @Get('/:id')
  async findUser(@Param('id') id: string) {
    // 1. 서비스 호출 (비동기 처리)
    const user = await this.usersService.findOne(parseInt(id));

    // 2. 결과가 null인지 확인 (서비스는 에러를 안 던지므로 여기서 처리)
    if (!user) {
      throw new NotFoundException('user not found');
    }

    // 3. 사용자 반환
    return user;
  }

  // 1. 별도의 경로 없이 기본 경로(@Get()) 사용
  // 요청 예시: GET /auth?email=abc@gmail.com
  @Get()
  findAllUsers(@Query('email') email: string) {
    // 2. 쿼리 스트링에서 추출한 email을 서비스로 전달
    // email은 문자열이므로 별도 변환 불필요
    return this.usersService.find(email);
  }

  /**
   * 사용자 삭제 핸들러
   * 요청: DELETE /auth/:id
   * 역할: URL의 ID를 받아 서비스를 통해 사용자 삭제
   */
  @Delete('/:id') // 1. DELETE 요청 매핑
  removeUser(@Param('id') id: string) {
    // 2. 파라미터 추출 및 타입 변환 (String -> Number)
    // 3. 서비스 계층의 remove 메서드 호출
    return this.usersService.remove(parseInt(id));
  }

  /**
   * 사용자 정보 수정 핸들러
   * 요청: PATCH /auth/:id
   * 역할: ID와 Body를 동시에 받아 서비스로 전달
   */
  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    // 1. id는 URL 파라미터이므로 문자열 -> 숫자로 변환 (parseInt)
    // 2. body는 UpdateUserDto를 통과하여 유효성이 검증된 객체
    return this.usersService.update(parseInt(id), body);
  }
}
