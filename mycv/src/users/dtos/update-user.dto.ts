import { IsEmail, IsString, IsOptional } from 'class-validator';

export class UpdateUserDto {
    // 이메일이 제공되면 이메일 형식을 검사하고, 없으면 통과
    @IsEmail()
    @IsOptional() 
    email?: string;

    // 비밀번호가 제공되면 문자열인지 검사하고, 없으면 통과
    @IsString()
    @IsOptional()
    password?: string;
}