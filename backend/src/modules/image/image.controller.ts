import { Controller, HttpCode, Post, Query, Res } from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { ImageService } from "./image.service";

@ApiTags("Image Manipulation")
@Controller("image")
export class ImageController {
    constructor(private readonly imageService: ImageService) {}

    @ApiOperation({
        summary: "Trim image",
        description:
            "This endpoint receives the URL of an image, converts it to a base64 string, and passes it to a Python script responsible for trimming empty borders or whitespace. The result is returned as a binary buffer representing the trimmed image.",
    })
    @ApiQuery({
        name: "imageUrl",
        required: true,
        description: "URL of the image to be trimmed",
    })
    @ApiResponse({
        status: 200,
        description: "Trimmed image successfully returned",
        schema: {
            type: "string",
            format: "binary",
        },
    })
    @ApiResponse({
        status: 400,
        description: "Invalid image URL or failed script execution",
    })
    @ApiResponse({
        status: 500,
        description: "Error processing the image or interpreting the script response",
    })
    @HttpCode(200)
    @Post("trim")
    async trimImage(@Query("imageUrl") imageUrl: string, @Res({ passthrough: true }) res: Response) {
        const imageBuffer = await this.imageService.trimImage(imageUrl);
        res.setHeader("Content-Type", "image/png");
        res.send(imageBuffer);
    }
}
