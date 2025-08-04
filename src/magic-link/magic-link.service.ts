import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMagicLinkDto } from './dto/create-magic-link.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { MagicLink } from './entities/magic-link.entity';
import { Repository } from 'typeorm';
import { User } from 'src/auth/entities/auth.entity';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class MagicLinkService {
  constructor(
    @InjectRepository(MagicLink)
    private readonly magikRepository: Repository<MagicLink>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly authService: AuthService,
  ) {}

  async create(createMagicLinkDto: CreateMagicLinkDto) {
    const { email } = createMagicLinkDto;

    let user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      user = this.userRepository.create({
        email: email,
        fullName: email,
        password: '',
        isActive: true,
      });
      await this.userRepository.save(user);
    }

    const token = this.authService.getToken({ id: user.id });
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    const magikLink = this.magikRepository.create({
      user,
      token,
      expiresAt,
    });

    await this.magikRepository.save(magikLink);

    const magicUrl = `http://localhost:4000/magic-link/verify?token=${token}`;

    return {
      message: 'Enlace generado',
      url: magicUrl,
    };
  }

  async verifyToken(token: string): Promise<string> {
    const magikLink = await this.magikRepository.findOne({
      where: { token: token },
    });

    if (!magikLink) throw new BadRequestException('token invalid');
    if (magikLink.used) throw new BadRequestException('token was used');
    if (magikLink.expiresAt < new Date())
      throw new BadRequestException('token expirado');

    magikLink.used = true;
    await this.magikRepository.save(magikLink);
    return magikLink.token;
  }
}
