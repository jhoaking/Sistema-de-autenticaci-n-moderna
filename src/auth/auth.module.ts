import { Module } from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm'
import {PassportModule} from '@nestjs/passport'
import {ConfigModule, ConfigService} from '@nestjs/config'
import {JwtModule} from '@nestjs/jwt'


import { User } from './entities/auth.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy/jwt-strategy';
import { TwoFactorModule } from 'src/two-factor/two-factor.module';
import { TwoFactor } from 'src/two-factor/entities/two-factor.entity';


@Module({
  controllers: [AuthController],
  providers: [AuthService,JwtStrategy],
  imports : [ 
    TwoFactorModule,
    ConfigModule, 
    TypeOrmModule.forFeature([User,TwoFactor]),
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
  exports : [TypeOrmModule,PassportModule,JwtModule,JwtStrategy]
})
export class AuthModule {}
