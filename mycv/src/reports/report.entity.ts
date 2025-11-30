import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Report {
  // 1. 고유 식별자
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false })
  approved: boolean;

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

  // (1) 대상 엔티티, (2) 대상 엔티티에서 나를 가리키는 속성
  @ManyToOne(() => User, (user) => user.reports)
  user: User;
}
