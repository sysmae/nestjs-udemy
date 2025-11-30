// src/reports/reports.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './report.entity';
import { CreateReportDto } from './dtos/create-report.dto';
import { User } from '../users/user.entity'; // User 임포트

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  // User 객체를 두 번째 인자로 받음
  create(reportDto: CreateReportDto, user: User) {
    // 1. DTO를 기반으로 리포트 엔티티 생성
    const report = this.repo.create(reportDto);

    // 2. 리포트와 유저 연결 (핵심!)
    // 유저 엔티티 전체를 할당하면 TypeORM이 알아서 처리함
    report.user = user;

    // 3. 저장
    return this.repo.save(report);
  }
}
