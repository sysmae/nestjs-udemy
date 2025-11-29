import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Report {
  // 1. 고유 식별자
  @PrimaryGeneratedColumn()
  id: number;

  // 2. 판매 가격
  @Column()
  price: number;

  // 3. 차량 제조사 (예: Toyota, Honda, Hyundai)
  @Column()
  make: string;

  // 4. 차량 모델 (예: Corolla, Civic, Sonata)
  @Column()
  model: string;

  // 5. 제조 연도
  @Column()
  year: number;

  // 6. 경도 (Longitude) - 위치 정보
  @Column()
  lng: number;

  // 7. 위도 (Latitude) - 위치 정보
  @Column()
  lat: number;

  // 8. 주행 거리 (Mileage)
  @Column()
  mileage: number;
}
