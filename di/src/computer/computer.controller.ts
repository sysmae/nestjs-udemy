import { Controller, Get } from '@nestjs/common';
import { CpuService } from 'src/cpu/cpu.service';
import { DiskService } from 'src/disk/disk.service';

@Controller('computer')
export class ComputerController {
    constructor(private cpuService: CpuService, private diskService: DiskService) {}

    getComputer() {
        const cpu = this.cpuService.compute(1, 2);
        const disk = this.diskService.getData();
        return { cpu, disk };
    }

    @Get()
    run(){
        return [
            // this.cpuService.compute(1, 2),
            // this.diskService.getData()
            this.getComputer()
        ]
    }
}

// 따로 라우트 안해도 /computer 로 가면 run이 실행됨
// http://localhost:3000/computer
// [{"cpu":3,"disk":"Data!"}]