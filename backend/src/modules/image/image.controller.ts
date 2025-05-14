import { Controller, Delete, HttpCode, Post, Query, Res } from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { ImageService } from "./image.service";

@ApiTags("Image Manipulation")
@Controller("image")
export class ImageController {
    constructor(private readonly imageService: ImageService) {}

    //#region @Decorators
    @ApiOperation({
        summary: "Save image",
        description:
            "This endpoint receives the URL of an image and then saves it to the filesystem. The result is returned as the public path to the image.",
    })
    @ApiQuery({ name: "imageUrl", description: "URL of the image to be saved", required: true })
    @ApiQuery({ name: "path", description: "Subpath for the image to be saved", required: false, default: "" })
    @ApiQuery({
        name: "trim",
        description: "Whether the image should be trimmed or not",
        required: true,
        default: false,
    })
    @ApiResponse({ status: 201, description: "Image saved successfuly", type: String })
    @ApiResponse({ status: 400, description: "Invalid image URL" })
    @ApiResponse({ status: 500, description: "Error processing the image" })
    //#endregion
    @Post()
    async saveImage(@Query("imageUrl") imageUrl: string, @Query("trim") trim: boolean, @Query("path") path?: string) {
        return await this.imageService.saveImage(imageUrl, path, trim);
    }

    //#region @Decorators
    @ApiOperation({
        summary: "Delete image",
        description: "This endpoint receives the name of an image and then deletes it from the filesystem.",
    })
    @ApiQuery({ name: "imageName", description: "Filename of the image to be deleted", required: true })
    @ApiQuery({ name: "path", description: "Subpath of the target image", required: false, default: "" })
    @ApiResponse({ status: 200, description: "Image deleted successfuly" })
    @ApiResponse({ status: 404, description: "Image not found with this name and/or path" })
    @ApiResponse({ status: 500, description: "Error during image deletion." })
    //#endregion
    @Delete()
    async deleteImage(@Query("imageName") imageName: string, @Query("path") path?: string) {
        await this.imageService.deleteImage(imageName, path);
    }

    //#region @Decorators
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
    @ApiResponse({ status: 400, description: "Invalid image URL or failed script execution" })
    @ApiResponse({ status: 500, description: "Error processing the image or interpreting the script response" })
    @HttpCode(200)
    //#endregion
    @Post("trim")
    async trimImage(@Query("imageUrl") imageUrl: string, @Res({ passthrough: true }) res: Response) {
        const imageBuffer = await this.imageService.trimImage(imageUrl);
        res.setHeader("Content-Type", "image/png");
        res.send(imageBuffer);
    }
}
