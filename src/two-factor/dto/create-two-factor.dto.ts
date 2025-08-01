import { IsBoolean } from 'class-validator';

export class ActiveTwoFactor {
  @IsBoolean()
  enable: boolean;
}
