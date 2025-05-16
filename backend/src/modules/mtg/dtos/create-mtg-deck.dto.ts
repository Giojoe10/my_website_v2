import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUrl } from "class-validator";

export class CreateMtgDeckDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsOptional()
    @IsString()
    @IsUrl()
    archidektUrl?: string;

    @IsOptional()
    @IsString()
    @IsUrl()
    ligamagicUrl?: string;

    @IsString()
    @IsUrl()
    @IsOptional()
    coverImageUrl?: string;

    @IsBoolean()
    completed: boolean;
}
