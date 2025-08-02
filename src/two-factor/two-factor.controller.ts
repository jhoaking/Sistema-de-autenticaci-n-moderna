import { Controller, Post, Body } from '@nestjs/common';


import { TwoFactorService } from './two-factor.service';
import { Auth } from '../auth/Decorator/auth.decorator';
import { User } from '../auth/entities/auth.entity';
import { GetUser } from '../auth/Decorator/get-user.decorator';
import { Verify2FADto } from './dto/verify-fad.dto';

@Controller('two-factor')
export class TwoFactorController {
  constructor(private readonly twoFactorService: TwoFactorService) {}

  @Post('/enable')
  @Auth()
  create( @GetUser()  user: User) {
    return this.twoFactorService.createSecret(user);
  }

  @Post('/verify')
  verifyUser(@Body() verifyDto : Verify2FADto){ 
    const {code , userId} = verifyDto
    return this.twoFactorService.verifyTwoFactor(userId,code)
  }
}
