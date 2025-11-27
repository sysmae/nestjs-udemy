import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

/**
 * @Injectable()
 * 이 데코레이터는 NestJS의 의존성 주입(DI) 시스템에 이 클래스를 등록합니다.
 * 즉, 이 클래스는 다른 컴포넌트(예: Controller)에서 주입받아 사용할 수 있는 
 * '서비스(Service)' 역할을 수행하게 됩니다.
 */
@Injectable()
export class UsersService {
    /**
     * 생성자 주입 (Constructor Injection)
     * * @InjectRepository(User)
     * TypeORM에게 'User' 엔티티를 관리하기 위한 리포지토리를 찾아 주입해달라고 요청합니다.
     * * private repo: Repository<User>
     * 주입받은 리포지토리를 이 클래스 내부에서 'repo'라는 변수로 사용하겠다고 선언합니다.
     * 이 리포지토리는 DB와 소통하는 인터페이스 역할을 하며, SQL 쿼리 없이도 데이터 조작을 가능하게 합니다.
     */
    constructor(@InjectRepository(User) private repo: Repository<User>) {}

    /**
     * 사용자 생성 로직
     * * 컨트롤러로부터 전달받은 이메일과 비밀번호를 사용하여 
     * DB에 새로운 사용자 레코드를 생성합니다.
     */
    create(email: string, password: string): Promise<User> {
        // [1단계: 엔티티 인스턴스 생성 - create]
        // * 중요: 이 라인은 데이터베이스에 접근하지 않습니다. (SQL 실행 X) *
        // 단순히 { email, password }라는 일반 객체(Plain Object)를 
        // User 엔티티 클래스의 '인스턴스'로 변환하여 메모리에 올리는 작업입니다.
        // 이 과정을 거쳐야 엔티티 클래스 내부에 정의된 메서드나 로직을 활용할 수 있습니다.
        const user = this.repo.create({ email, password });

        // [2단계: 영구 저장 - save]
        // * 실제 데이터베이스 통신 발생 (INSERT 쿼리 실행 O) *
        // 위에서 만든 user 인스턴스를 데이터베이스에 영구적으로 저장합니다.
        // I/O 작업이므로 비동기(Promise)로 처리되며, 
        // 저장이 완료되면 생성된 ID 등을 포함한 최종 User 객체를 반환합니다.
        return this.repo.save(user);
    }

    /**
     * ID를 기반으로 단일 사용자를 조회합니다.
     * TypeORM 0.3.0부터는 findOne(id) 대신 findOneBy({ id })를 권장합니다.
     * * @param id 조회할 사용자의 고유 ID
     * @returns User 엔티티 또는 null
     */
    findOne(id: number) {
        if (!id) {
        return null; 
        }
        // 변경된 문법 적용: findOneBy 사용
        return this.repo.findOneBy({ id });
    } 

     /**
     * 이메일을 기반으로 사용자를 조회합니다.
     * 이메일 중복이 허용된 시스템일 수 있으므로 배열 형태([])를 반환합니다.
     * * @param email 조회할 이메일 주소
     * @returns User[] (사용자 배열)
     */
    find(email: string) {
        // TypeORM 0.3.0 문법: where 절 명시 필수
        return this.repo.find({ where: { email } });
    }

     /**
     * 사용자 정보 수정 메서드
     * * @param id 수정할 사용자의 ID
     * @param attrs 수정할 속성들이 담긴 객체 (Partial<User>)
     * Partial을 사용하여 email만, 혹은 password만 전달받을 수 있음.
     */
    async update(id: number, attrs: Partial<User>) {
        // [1단계] 조회: 업데이트할 대상을 먼저 찾는다.
        const user = await this.findOne(id);

        // [예외 처리] 대상이 없으면 로직을 중단하고 에러를 던진다.
        if (!user) {
            throw new NotFoundException('user not found');
        }

        // [2단계] 병합: 기존 user 객체에 attrs의 내용을 덮어씌운다.
        // 예: user.email은 유지되고 user.password만 변경될 수 있음.
        Object.assign(user, attrs);

        // [3단계] 저장: 변경된 객체를 저장한다.
        // 이때 save 메서드는 엔터티 훅(@AfterUpdate 등)을 트리거한다.
        return this.repo.save(user);
    }

    /** 
     * 사용자 삭제 메서드
     * delete 대신 remove를 사용하여 엔터티 훅(@AfterRemove)이 실행되도록 보장합니다.
     * * * @param id 삭제할 사용자의 ID
     * @returns 삭제된 User 엔터티
     * @throws NotFoundException 사용자가 존재하지 않을 경우
     */
    async remove(id: number) {
        // [1단계] 조회: 삭제할 대상이 있는지 먼저 확인합니다.
        const user = await this.findOne(id);

        // [2단계] 검증: 대상이 없으면 에러를 던져 로직을 중단합니다.
        if (!user) {
            throw new NotFoundException('user not found');
        }

        // [3단계] 삭제: 조회된 엔터티 인스턴스를 전달하여 삭제합니다.
        // 이 과정에서 @BeforeRemove, @AfterRemove 훅이 실행됩니다.
        return this.repo.remove(user);
    }
}