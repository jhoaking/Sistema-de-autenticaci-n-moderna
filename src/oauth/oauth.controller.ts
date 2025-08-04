import { Controller, Get, Post, Body, Param, Query, Res } from '@nestjs/common';
import { OauthService } from './oauth.service';
import { CreateOauthDto } from './dto/create-oauth.dto';
import { Response } from 'express';

@Controller('oauth')
export class OauthController {
  constructor(private readonly oauthService: OauthService) {}

  @Post('login')
  create(@Body() createOauthDto: CreateOauthDto) {
    return this.oauthService.create(createOauthDto);
  }

  @Get('login/callback')
  async callback(
    @Param('provider') provider: string,
    @Query('code') code: string,
    @Res() res: Response,
  ) {
    const { tokenOauth } = await this.oauthService.getCallBack(code);
    return res.send(`
    <html>
      <head><title>Login exitoso</title></head>
      <body>
        <h1>🎉 ¡Inicio de sesión exitoso!</h1>
        <p>Tu token JWT es:</p>
        <pre style="background:#eee;padding:1rem">${tokenOauth}</pre>
        <p>¡Cópialo y úsalo para autenticarte en la app!</p>
      </body>
    </html>
  `);
  }
}
