import { Injectable } from '@nestjs/common';
import { PowerService } from 'src/power/power.service';

@Injectable()
export class DiskService {
    constructor(private powerService: PowerService) {}

    getData() {
    console.log('20와트의 전력을 소모하여 데이터를 찾습니다.');
    this.powerService.supplyPower(20); // 주입받은 서비스 사용
    return 'Data!';
  }
}
