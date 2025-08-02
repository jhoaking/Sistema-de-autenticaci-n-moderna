import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { authenticator } from 'otplib';
import { TwoFactor } from './entities/two-factor.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/auth/entities/auth.entity';

@Injectable()
export class TwoFactorService {
  constructor(
    @InjectRepository(TwoFactor)
    private readonly twoFactorRepository: Repository<TwoFactor>,
    private readonly jwtService: JwtService,
  ) {}

  async createSecret(user: User) {
    const secret = authenticator.generateSecret();
    const url = authenticator.keyuri(
      user.email,
      'autenticacion-moderna',
      secret,
    );

    let twoFactor = await this.twoFactorRepository.findOne({
      where: { user: { id: user.id } },
    });

    if (!twoFactor) {
      twoFactor = this.twoFactorRepository.create({
        user,
        secret,
        enable: true,
      });
    } else {
      ((twoFactor.secret = secret), (twoFactor.enable = true));
    }

    await this.twoFactorRepository.save(twoFactor);

    return { message: '2FA activado correctamente', qrCode: url };
  }

  verifyToken(token: string, secret: string): boolean {
    return authenticator.verify({ token, secret });
  }

  async verifyTwoFactor(user_id: string, code: string) {
    const twoFactor = await this.twoFactorRepository.findOne({
      where: { user: { id: user_id } },
    });

    if (!twoFactor || !twoFactor.enable) {
      throw new UnauthorizedException('2FA not enable for this user');
    }

    const isValid = this.verifyToken(code, twoFactor.secret);

    if (!isValid) throw new UnauthorizedException('co9de 2FA invalid');

    const payload = { id: twoFactor.user.id };
    const token = this.jwtService.sign(payload);
    return { message: '2FA verificado correctamente', token };
  }
}
