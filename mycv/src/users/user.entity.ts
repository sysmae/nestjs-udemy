import {AfterInsert,AfterRemove, AfterUpdate,Entity, Column, PrimaryGeneratedColumn} from "typeorm";
import { Exclude } from "class-transformer";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    email: string

    // 비밀번호 컬럼에 Exclude 데코레이터를 붙인다.
    // 이 속성은 직렬화 과정에서 자동으로 제거된다.
    @Column()
    @Exclude() 
    password: string

    @AfterInsert()
    logInsert(){
        console.log('Inserted User with id', this.id)
    }

    @AfterUpdate()
    logUpdate(){
        console.log('Updated User with id', this.id)
    }

    @AfterRemove()
    logRemove(){
        console.log('Removed User with id', this.id)
    }
}