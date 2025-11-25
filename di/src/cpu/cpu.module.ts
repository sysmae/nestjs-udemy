import { Module } from '@nestjs/common';
import { CpuService } from './cpu.service';
import { PowerModule } from 'src/power/power.module';

@Module({
  imports: [PowerModule], // PowerModule 전체를 가져옴
  providers: [CpuService]
})
export class CpuModule {}
