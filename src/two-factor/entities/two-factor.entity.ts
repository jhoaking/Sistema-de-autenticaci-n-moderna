import { User } from "src/auth/entities/auth.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity({name : 'twoFactowAuth'})
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
        (user) => user.twoFactor
    )
    @JoinColumn()
    user : User
}
