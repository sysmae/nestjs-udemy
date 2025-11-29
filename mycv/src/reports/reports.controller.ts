import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportsService } from './reports.service';
import { AuthGuard } from '../guards/auth.guard';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Post()
  @UseGuards(AuthGuard) // 로그인 필수
  createReport(@Body() body: CreateReportDto) {
    // 서비스 호출 (이제 실제로 작동함)
    return this.reportsService.create(body);
  }
}
