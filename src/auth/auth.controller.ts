import { Controller, Get, Post, Body} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { Auth } from './Decorator/auth.decorator';
import { GetUser } from './Decorator/get-user.decorator';
import {  User } from './entities/auth.entity';
import { ValidRoles } from './interfaces';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  createUser(@Body() createAuthDto: CreateUserDto) {
    return this.authService.registerUser(createAuthDto);
  }

@Post('/login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }



  @Get('private')
  @Auth(ValidRoles.admin)
  privateRoute(@GetUser() user:User){
    return {
      ok : true,
      user
    }
  }

}
