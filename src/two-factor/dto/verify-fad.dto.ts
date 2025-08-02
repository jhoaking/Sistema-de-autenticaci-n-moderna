import { IsString, Length } from "class-validator";


export class Verify2FADto {
    @IsString()
    code : string

    @IsString()
    userId : string
}