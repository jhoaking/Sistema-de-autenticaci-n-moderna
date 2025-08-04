import { Module } from '@nestjs/common';
import { MagicLinkService } from './magic-link.service';
import { MagicLinkController } from './magic-link.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MagicLink } from './entities/magic-link.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [MagicLinkController],
  providers: [MagicLinkService],
  imports: [TypeOrmModule.forFeature([MagicLink]), AuthModule],
  exports: [TypeOrmModule, MagicLinkService],
})
export class MagicLinkModule {}
