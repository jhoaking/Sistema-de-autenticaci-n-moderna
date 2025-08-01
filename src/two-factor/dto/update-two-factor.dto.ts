import { PartialType } from '@nestjs/mapped-types';
import { CreateTwoFactorDto } from './create-two-factor.dto';

export class UpdateTwoFactorDto extends PartialType(CreateTwoFactorDto) {}
