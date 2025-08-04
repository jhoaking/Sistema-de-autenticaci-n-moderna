import { Module } from '@nestjs/common';
import { OauthService } from './oauth.service';
import { OauthController } from './oauth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Oauth } from './entities/oauth.entity';
import { AuthModule } from 'src/auth/auth.module';
import { HttpAxiosAdapter } from './adapter/http-adapter';

@Module({
  controllers: [OauthController],
  providers: [OauthService, HttpAxiosAdapter],
  imports: [TypeOrmModule.forFeature([Oauth]), AuthModule],
  exports: [HttpAxiosAdapter],
})
export class OauthModule {}
