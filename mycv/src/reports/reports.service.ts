import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './report.entity';
import { CreateReportDto } from './dtos/create-report.dto';

@Injectable()
export class ReportsService {
  constructor(
    // 1. 의존성 주입: Report 엔터티 전용 리포지토리를 요청
    @InjectRepository(Report)
    private repo: Repository<Report>,
  ) {}

  // 2. 생성 로직: DTO를 받아 저장
  create(reportDto: CreateReportDto) {
    // 3. 엔터티 인스턴스 생성 (메모리 상에만 존재)
    // create()는 DTO 객체를 TypeORM 엔터티 객체로 변환해 줍니다.
    const report = this.repo.create(reportDto);

    // 4. 데이터베이스 저장 (INSERT 쿼리 실행)
    // save()는 DB에 저장 후, 생성된 ID가 포함된 엔터티를 반환합니다.
    return this.repo.save(report);
  }
}
