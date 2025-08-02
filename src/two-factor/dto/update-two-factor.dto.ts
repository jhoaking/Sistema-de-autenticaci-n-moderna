import { PartialType } from '@nestjs/mapped-types';
import { ActiveTwoFactor } from './create-two-factor.dto';

export class UpdateTwoFactorDto extends PartialType(ActiveTwoFactor) {}
