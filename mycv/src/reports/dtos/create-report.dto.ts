import {
  IsString,
  IsNumber,
  Min,
  Max,
  IsLongitude,
  IsLatitude,
} from 'class-validator';

export class CreateReportDto {
  // 1. 차량 정보 (문자열)
  @IsString()
  make: string;

  @IsString()
  model: string;

  // 2. 제조 연도 (숫자, 범위 제한)
  @IsNumber()
  @Min(1930) // 너무 오래된 차는 제외 (비즈니스 로직에 따라 조정)
  @Max(2050)
  year: number;

  // 3. 주행 거리 (숫자, 범위 제한)
  @IsNumber()
  @Min(0) // 마일리지는 음수가 될 수 없음
  @Max(1000000)
  mileage: number;

  // 4. 위치 정보 (지리적 좌표 검증)
  @IsLongitude() // 경도: -180 ~ 180 사이인지 자동 검증
  lng: number;

  @IsLatitude() // 위도: -90 ~ 90 사이인지 자동 검증
  lat: number;

  // 5. 판매 가격 (숫자, 양수)
  @IsNumber()
  @Min(0)
  @Max(1000000)
  price: number;
}
