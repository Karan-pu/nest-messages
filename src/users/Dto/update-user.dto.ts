import { IsNumber, IsString, IsEmail, IsOptional} from "class-validator";
export class UpdateUserDto {
    @IsNumber()
    @IsOptional()
    id: number;

    @IsEmail()
    @IsOptional()
    email: string;

    @IsOptional()
    @IsString()
    password: string;
} 
