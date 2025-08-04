import { User } from "src/auth/entities/auth.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity({name : 'oauth_login'})
export class Oauth {

    @PrimaryGeneratedColumn('uuid')
    id : string;


    @Column('text')
    provider : string;

    @Column('text')
    providerUserId : string;


    @Column('text',{
        nullable : true
    })
    email: string;


    @CreateDateColumn()
    createdAt : Date


    @ManyToOne(
        () => User,
        (user) => user.oauthAccount,
        {eager : true}
    )
    user : User
}


