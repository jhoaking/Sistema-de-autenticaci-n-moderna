import { Injectable } from '@nestjs/common';
import { CreateTwoFactorDto } from './dto/create-two-factor.dto';
import { UpdateTwoFactorDto } from './dto/update-two-factor.dto';

@Injectable()
export class TwoFactorService {
  create(createTwoFactorDto: CreateTwoFactorDto) {
    return 'This action adds a new twoFactor';
  }

  findAll() {
    return `This action returns all twoFactor`;
  }

  findOne(id: number) {
    return `This action returns a #${id} twoFactor`;
  }

  update(id: number, updateTwoFactorDto: UpdateTwoFactorDto) {
    return `This action updates a #${id} twoFactor`;
  }

  remove(id: number) {
    return `This action removes a #${id} twoFactor`;
  }
}
