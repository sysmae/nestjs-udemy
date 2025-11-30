// src/reports/reports.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './report.entity';
import { CreateReportDto } from './dtos/create-report.dto';
import { User } from '../users/user.entity'; // User 임포트
import { GetEstimateDto } from './dtos/get-estimate.dto';

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

  // [핵심 구현] 승인 상태 변경 메서드
  async changeApproval(id: string, approved: boolean) {
    // 1. TypeORM 0.3.0 대응: where 절을 명시적으로 사용해야 함
    // id는 컨트롤러에서 string으로 오지만 DB는 number일 수 있으므로 parseInt로 변환
    const report = await this.repo.findOne({ where: { id: parseInt(id) } });

    // 2. 예외 처리: 리포트가 없는 경우
    if (!report) {
      throw new NotFoundException(
        '리포트를 찾을 수 없습니다 (Report not found)',
      );
    }

    // 3. 속성 업데이트
    report.approved = approved;

    // 4. 저장 및 반환
    return this.repo.save(report);
  }

  createEstimate({ make, model, lng, lat, year, mileage }: GetEstimateDto) {
    return this.repo
      .createQueryBuilder('report')
      .select('AVG(report.price)', 'price') // 4. 평균 가격 선택 및 별칭 지정
      .where('report.make = :make', { make }) // 1. 기본 필터 (make)
      .andWhere('report.model = :model', { model }) // 2. 추가 필터 (andWhere 사용)
      .andWhere('report.lng - :lng BETWEEN -5 AND 5', { lng }) // 경도 ±5도
      .andWhere('report.lat - :lat BETWEEN -5 AND 5', { lat }) // 위도 ±5도
      .andWhere('report.year - :year BETWEEN -3 AND 3', { year }) // 연도 ±3년
      .andWhere('report.approved IS TRUE') // (일반적으로 승인된 리포트만 검색합니다)
      .orderBy('ABS(report.mileage - :mileage)', 'DESC') // 3. 주행거리 차이로 정렬
      .setParameters({ mileage }) // orderBy는 파라미터 객체를 받지 않으므로 따로 설정
      .limit(3) // 상위 3개만 선택
      .getRawOne(); // 5. 집계된 결과(Raw Data) 하나만 반환
  }
}
