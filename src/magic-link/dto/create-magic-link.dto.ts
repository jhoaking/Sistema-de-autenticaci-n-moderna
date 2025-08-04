import { IsEmail } from 'class-validator';

export class CreateMagicLinkDto {
  @IsEmail()
  email: string;
}
