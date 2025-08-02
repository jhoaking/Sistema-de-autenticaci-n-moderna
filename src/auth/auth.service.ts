import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/auth.entity';
import { JwtPayload } from './interfaces/jwt-payload-user.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,
  ) {}

  async registerUser(createAuthDto: CreateUserDto) {
    const { password, ...rest } = createAuthDto;
    try {
      const user = this.userRepository.create({
        ...rest,
        password: bcrypt.hashSync(password, 10),
        createdAt: new Date(),
      });

      await this.userRepository.save(user);

      return { user, token: this.getToken({ id: user.id }) };
    } catch (error) {
      console.log(error);

      this.handlerDbError(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;

    try {
      const user = await this.userRepository.findOne({
        where: { email },
        select: { email: true, password: true ,id : true},
        relations: ['twoFactor'],
      });

      if (!user)
        throw new UnauthorizedException(`user with ${email} not valid`);

      if (!bcrypt.compareSync(password, user.password))
        throw new UnauthorizedException(`password  of user not valid `);

      if (user.twoFactor?.enable) {
        return { requireFa: true, user_id: user.id, message: '2FA required',token : this.getToken({id : user.id}) };
      }

      return { user, token: this.getToken({ id: user.id }) };
    } catch (error) {
      console.log(error);

      this.handlerDbError(error);
    }
  }

  private getToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }



  private handlerDbError(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }else if (error.code === '42703'){
      throw new BadRequestException(error.detail);
    }
 
    console.log(error);

    throw new InternalServerErrorException('please check server  logs');
  }

  


}
