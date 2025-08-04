import { BadRequestException, Injectable, Redirect } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateOauthDto } from './dto/create-oauth.dto';
import { Oauth } from './entities/oauth.entity';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/auth/entities/auth.entity';
import { HttpAxiosAdapter } from './adapter/http-adapter';

@Injectable()
export class OauthService {
  constructor(
    @InjectRepository(Oauth)
    private readonly oauthRepository: Repository<Oauth>,

    @InjectRepository(User)
    private readonly authRepository: Repository<User>,

    private readonly authService: AuthService,

    private readonly httpAdapter: HttpAxiosAdapter,
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
    console.log('CODEEEEEEEEEEE', code);

    if (!code) {
      throw new BadRequestException('code not provided');
    }

    const { data: tokenData } =
      await this.httpAdapter.post<GoogleTokenResponse>(
        'https://oauth2.googleapis.com/token',
        {
          code,
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.SECRET_TOKEN_GOOGLE,
          redirect_uri: process.env.REDIRECT_URI,
          grant_type: 'authorization_code',
        },
        {},
      );

    const accessToken = tokenData.access_token;

    const userInfo = await this.httpAdapter.get<GoogleUserInfo>(
      'https://www.googleapis.com/oauth2/v2/userinfo',
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );

    const { id: providerUserId, email, name: fullName } = userInfo.data;

    const tokenOauth = await this.create({
      provider: 'google',
      providerUserId,
      email,
      fullName,
    });

    return {
      tokenOauth: tokenOauth,
    };
  }
}
