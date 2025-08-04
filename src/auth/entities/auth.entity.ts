import { MagicLink } from 'src/magic-link/entities/magic-link.entity';
import { Oauth } from 'src/oauth/entities/oauth.entity';
import { TwoFactor } from 'src/two-factor/entities/two-factor.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  fullName: string;

  @Column('text', {
    unique: true,
  })
  email: string;

  @Column('text', {
    select: true,
  })
  password: string;

  @Column('bool', {
    default: true,
  })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @Column('text', {
    array: true,
    default: ['user'],
  })
  roles: string[];

  @OneToOne(() => TwoFactor, 
  (twoFactor) => twoFactor.user,
  { cascade: true })
  twoFactor: TwoFactor;



  @OneToMany(
    () => Oauth,
    (oauth) => oauth.user,
    {cascade : true}
  )
  oauthAccount?:Oauth[]


  @OneToMany(
    () => MagicLink,
    (magik_link) => magik_link.user,
    {cascade : true}
  )
  magikLink?: MagicLink[]

  @BeforeInsert()
  checkFieldBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
  }

  @BeforeUpdate()
  checkFieldBeforeUpdate() {
    this.checkFieldBeforeInsert();
  }
}
