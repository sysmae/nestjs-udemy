import { rm } from 'fs/promises';
import { join } from 'path';

// 전역 beforeEach 등록
// 이 함수는 모든 e2e 테스트 케이스가 시작되기 직전에 실행됨
global.beforeEach(async () => {
  try {
    // 1. 삭제할 파일 경로 설정 (프로젝트 루트의 test.sqlite)
    // __dirname은 현재 파일(test/)의 위치이므로, 상위 폴더(..)로 가야 루트임
    const dbPath = join(__dirname, '..', 'test.sqlite');

    // 2. 파일 삭제 시도
    await rm(dbPath);
  } catch (err) {
    // 3. 예외 처리 (파일이 없는 경우)
    // 파일을 지우려고 했는데 파일이 없어서 에러가 났다면?
    // 이미 지워져 있는 것이니 좋은 일이다. 에러를 무시하고 넘어간다.
  }
});
