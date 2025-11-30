import {
  IsString,
  IsNumber,
  Min,
  Max,
  IsLongitude,
  IsLatitude,
} from 'class-validator';
import { Transform } from 'class-transformer'; // 1. Transform 임포트

export class GetEstimateDto {
  @IsString()
  make: string;

  @IsString()
  model: string;

  // 2. Transform 적용: 입력된 value를 정수(Integer)로 변환
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1930)
  @Max(2050)
  year: number;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(0)
  @Max(1000000)
  mileage: number;

  // 3. Transform 적용: 입력된 value를 실수(Float)로 변환
  @Transform(({ value }) => parseFloat(value))
  @IsLongitude()
  lng: number;

  @Transform(({ value }) => parseFloat(value))
  @IsLatitude()
  lat: number;
}
