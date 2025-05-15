import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
    ArrayNotEmpty,
    IsArray,
    IsBoolean,
    IsInt,
    IsNumber,
    IsOptional,
    IsPositive,
    Length,
    Max,
    Min,
    ValidateNested,
} from "class-validator";
import { WantCardDto } from "./want-card.dto";

export class GenerateWantDto {
    @ApiProperty({
        description: "Array of cards to generate wants from",
        type: [WantCardDto],
        example: [{ id: "Colossal Dreadmaw", quantity: 1, foil: false, price: 0.04 }],
    })
    @IsArray({ message: "Cards must be an array." })
    @ArrayNotEmpty({ message: "Cards array must not be empty." })
    @ValidateNested({ each: true })
    @Type(() => WantCardDto)
    cards: WantCardDto[];

    @ApiPropertyOptional({
        description: "Number of columns for the output layout (between 1 and 6)",
        minimum: 1,
        maximum: 6,
        default: 5,
    })
    @IsInt({ message: "Columns must be an integer." })
    @Min(1, { message: "Columns must be at least 1." })
    @Max(6, { message: "Columns must not be greater than 6." })
    @IsOptional()
    columns?: number;

    @ApiPropertyOptional({
        description: "Card size as a tuple [width, height]",
        type: [Number],
        default: [745, 1040],
        minItems: 2,
        maxItems: 2,
    })
    @IsArray({ message: "Card size must be an array." })
    @IsInt({ each: true, message: "Card size values must be integers." })
    @IsPositive({ each: true, message: "Card size values must be postive." })
    @Length(2, 2, { message: "Card size array must contain exactly 2 elements." })
    @IsOptional()
    cardSize?: number[];

    @ApiProperty({
        description: "Aspect ratio of the output (between 0.25 and 2, recommended to be a multiple of 0.25)",
        minimum: 0.25,
        maximum: 2,
        default: 0.25,
    })
    @IsNumber({}, { message: "Ratio must be a number." })
    @Min(0.25, { message: "Ratio must be at least 0.25." })
    @Max(2, { message: "Ratio must not exceed 2." })
    @IsOptional()
    ratio?: number;

    @ApiProperty({
        description: "Whether to show the quantity in front of the cards or not",
        default: true,
    })
    @IsBoolean()
    @IsOptional()
    showQuantity?: boolean;
}
