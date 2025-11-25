import { Injectable } from '@nestjs/common';
import { PowerService } from '../power/power.service';

@Injectable()
export class CpuService {
    // 생성자를 통해 PowerService의 인스턴스를 주입받음
    constructor(private powerService: PowerService) {}
}
