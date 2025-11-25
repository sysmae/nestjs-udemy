import { Module } from '@nestjs/common';
import { CpuService } from './cpu.service';
import { PowerModule } from 'src/power/power.module';

@Module({
  imports: [PowerModule], // PowerModule 전체를 가져옴
  providers: [CpuService],
  exports: [CpuService], // 외부에서 사용할 수 있도록 공개  
})
export class CpuModule {}
