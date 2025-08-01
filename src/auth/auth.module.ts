import { Module } from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm'
import {PassportModule} from '@nestjs/passport'
import {ConfigModule, ConfigService} from '@nestjs/config'
import {JwtModule} from '@nestjs/jwt'


import { Auth } from './entities/auth.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';


@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports : [ 
    ConfigModule, 
    TypeOrmModule.forFeature([Auth]),
    PassportModule.register({defaultStrategy : 'jwt'}),

    JwtModule.registerAsync({
      imports : [ConfigModule],
      inject : [ConfigService],
      useFactory : (configService:ConfigService)=>{
        return {
          secret : configService.get('JWT_SECRET'),
          signOptions:{
            expiresIn : '2h'
          }
        }
      }
    })
  ],
  exports : [TypeOrmModule,PassportModule,JwtModule]
})
export class AuthModule {}
