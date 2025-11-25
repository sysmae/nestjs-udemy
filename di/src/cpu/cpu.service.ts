import { Injectable } from '@nestjs/common';
import { PowerService } from '../power/power.service';

@Injectable()
export class CpuService {
    // 생성자를 통해 PowerService의 인스턴스를 주입받음
    constructor(private powerService: PowerService) {}

    compute(a:number, b:number) {
        console.log('10와트의 전력을 소모하여 연산을 수행합니다.');
        this.powerService.supplyPower(10);
        return a + b;
    }
}
