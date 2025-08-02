import { User } from "src/auth/entities/auth.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity({name : 'two_factor_auth'})
export class TwoFactor {

    @PrimaryGeneratedColumn('uuid')
    id : string;

    @Column('text',{
        unique : true
    })
    secret : string;    

    @Column('bool', {
        default : false
    })
    enable : boolean

    @OneToOne(
        () => User,
        (user) => user.twoFactor,
    ) 
    @JoinColumn({ name: 'user_id' })
    user : User
}
