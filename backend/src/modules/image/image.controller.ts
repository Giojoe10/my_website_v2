import { Controller, Post, Query, Res } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { ImageService } from "./image.service";

@ApiTags("Image Manipulation")
@Controller("image")
export class ImageController {
    constructor(private readonly imageService: ImageService) {}

    @Post("trim")
    async trimImage(@Query("imageUrl") imageUrl: string, @Res({ passthrough: true }) res: Response) {
        const imageBuffer = await this.imageService.trimImage(imageUrl);
        res.setHeader("Content-Type", "image/png");
        res.send(imageBuffer);
    }
}
