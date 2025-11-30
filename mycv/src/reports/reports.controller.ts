// src/reports/reports.controller.ts

import {
  Controller,
  Post,
  Body,
  UseGuards,
  Patch,
  Param,
  Get,
  Query,
} from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportsService } from './reports.service';
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUser } from '../users/decorators/current-user.decorator'; // 데코레이터 임포트
import { User } from '../users/user.entity'; // User 엔티티 임포트
import { Serialize } from '../interceptors/serialize.interceptor';
import { ReportDto } from './dtos/report.dto';
import { ApproveReportDto } from './dtos/approve-report.dto';
import { AdminGuard } from 'src/guards/admin.guard';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Serialize(ReportDto)
  createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
    // user 추출
    // 서비스에 리포트 정보와 유저 정보를 함께 전달
    return this.reportsService.create(body, user);
  }

  @Patch('/:id') // 와일드카드(:id)를 사용하여 동적인 경로 처리
  @UseGuards(AdminGuard)
  approveReport(@Param('id') id: string, @Body() body: ApproveReportDto) {
    return this.reportsService.changeApproval(id, body.approved);
  }

  @Get('/estimate')
  getEstimate(@Query() query: GetEstimateDto) {
    // return this.reportsService.createEstimate(query);
    console.log(query);
  }
}
