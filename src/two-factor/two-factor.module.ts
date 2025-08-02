import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';


import { TwoFactorService } from './two-factor.service';
import { TwoFactorController } from './two-factor.controller';
import { TwoFactor } from './entities/two-factor.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [TwoFactorController],
  providers: [TwoFactorService],
  imports : [TypeOrmModule.forFeature([TwoFactor]),AuthModule],
  exports : [TypeOrmModule,TwoFactorService]
})
export class TwoFactorModule {}
