// src/reports/reports.controller.ts

import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportsService } from './reports.service';
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUser } from '../users/decorators/current-user.decorator'; // 데코레이터 임포트
import { User } from '../users/user.entity'; // User 엔티티 임포트

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Post()
  @UseGuards(AuthGuard)
  createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
    // user 추출
    // 서비스에 리포트 정보와 유저 정보를 함께 전달
    return this.reportsService.create(body, user);
  }
}
