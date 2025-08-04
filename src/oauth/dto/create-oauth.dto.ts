import { IsEmail, IsIn, IsOptional, IsString } from 'class-validator';

export class CreateOauthDto {
  @IsIn(['google', 'github','facebook'])
  provider: string;

  @IsString()
  providerUserId: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsString()
  avatar?: string;
}
