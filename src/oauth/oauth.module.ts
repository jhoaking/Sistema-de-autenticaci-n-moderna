import { Module } from '@nestjs/common';
import { OauthService } from './oauth.service';
import { OauthController } from './oauth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Oauth } from './entities/oauth.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [OauthController],
  providers: [OauthService],
  imports : [
    TypeOrmModule.forFeature([Oauth]),
    AuthModule
    ]
})
export class OauthModule {}
