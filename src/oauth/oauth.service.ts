import { BadRequestException, Injectable, Redirect } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import axios from 'axios';

import { CreateOauthDto } from './dto/create-oauth.dto';
import { Oauth } from './entities/oauth.entity';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/auth/entities/auth.entity';

@Injectable()
export class OauthService {
  constructor(
    @InjectRepository(Oauth)
    private readonly oauthRepository: Repository<Oauth>,

    @InjectRepository(User)
    private readonly authRepository: Repository<User>,

    private readonly authService: AuthService,
  ) {}

  async create(createOauthDto: CreateOauthDto) {
    const oauthUser = await this.oauthRepository.findOne({
      where: {
        providerUserId: createOauthDto.providerUserId,
        provider: 'google',
      },
    });

    if (oauthUser) {
      return this.authService.getToken({ id: oauthUser.user.id });
    }

    const newUser = this.authRepository.create({
      email: createOauthDto.email,
      fullName: createOauthDto.fullName,
      isActive: true,
      password: '',
    });

    await this.authRepository.save(newUser);

    const oauth = this.oauthRepository.create({
      provider: createOauthDto.provider,
      providerUserId: createOauthDto.providerUserId,
      user: newUser,
    });

    await this.oauthRepository.save(oauth);

    return this.authService.getToken({ id: newUser.id });
  }

  async getCallBack(code: string) {
    if (!code) {
      throw new BadRequestException('code not provided');
    }

    const tokenResponse = await axios.post(
      'https://oauth2.googleapis.com/token',
      {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.SECRET_TOKEN_GOOGLE,
        redirect_uri: process.env.REDIRECT_URI,
        grant_type: 'authorization_code',
      },
    );

    const accessToken = tokenResponse.data.access_token;

    const userInfo = await axios.get(
      'https://www.googleapis.com/oauth2/v2/userinfo',
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );

    const { id: providerUserId, email, name: fullName } = userInfo.data;

    const tokenOauth = await  this.create({
      provider: 'google',
      providerUserId,
      email,
      fullName,
    });

    return {
      redirect_uri: `http://localhost:3000/login-success?token=${tokenOauth}`,
    };
  }
}
