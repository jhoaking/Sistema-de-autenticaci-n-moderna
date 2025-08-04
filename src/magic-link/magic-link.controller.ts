import { Controller, Get, Post, Body, Query, Res } from '@nestjs/common';
import { MagicLinkService } from './magic-link.service';
import { CreateMagicLinkDto } from './dto/create-magic-link.dto';
import { Response } from 'express';

@Controller('magic-link')
export class MagicLinkController {
  constructor(private readonly magicLinkService: MagicLinkService) {}

  @Post('send')
  create(@Body() createMagicLinkDto: CreateMagicLinkDto) {
    return this.magicLinkService.create(createMagicLinkDto);
  }

  @Get('verify')
  async verify(@Query('token') token: string, @Res() res: Response) {
    const jwt = await this.magicLinkService.verifyToken(token);
    return res.json({ message: 'Token válido', jwt });
  }
}
