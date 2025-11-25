import { Module } from '@nestjs/common';
import { PowerService } from './power.service';

@Module({
  providers: [PowerService], // 내부에서 사용하기 위해 등록
  exports: [PowerService]    // 외부에서 사용할 수 있도록 공개 (핵심!)
})
export class PowerModule {}