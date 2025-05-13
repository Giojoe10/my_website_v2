import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { spawn } from "node:child_process";
import { createWriteStream, existsSync, mkdirSync, unlinkSync, writeFileSync } from "node:fs";
import { extname, join, resolve } from "node:path";
import { Readable, pipeline } from "node:stream";
import { promisify } from "node:util";
import { PythonResponseDto } from "src/common/dtos/python-response.dto";
import { validateUrl } from "src/common/utils/validateUrl";
import { v4 as uuid } from "uuid";
const streamPipeline = promisify(pipeline);

@Injectable()
export class ImageService {
    private readonly uploadDir = resolve(process.cwd(), "public");

    async trimImage(imageUrl: string): Promise<Buffer> {
        if (!validateUrl(imageUrl)) {
            throw new BadRequestException("URL not valid!");
        }
        const base64Image = await this.imageUrlToBase64(imageUrl);
        const scriptPath = join(__dirname, "..", "..", "..", "scripts", "trim_image.py");

        const pythonResponse = await new Promise<PythonResponseDto>((resolve, reject) => {
            const python = spawn("py", [scriptPath]);

            python.stdin.write(base64Image);
            python.stdin.end();

            let data = "";
            let error = "";

            python.stdout.on("data", (chunk) => {
                data += chunk;
            });

            python.stderr.on("data", (chunk) => {
                error += chunk;
            });

            python.on("close", (code) => {
                if (code !== 0) {
                    return reject(`Erro ao executar script: ${error}`);
                }

                try {
                    const resultado = JSON.parse(data);
                    resolve(resultado); // <- Aqui retorna o resultado corretamente
                } catch (e) {
                    reject("Erro ao interpretar a saída do Python.");
                }
            });
        });
        // return Buffer.from(base64Image, "base64");
        return Buffer.from(pythonResponse.image, "base64");
    }

    async imageUrlToBase64(imageUrl: string): Promise<string> {
        const response = await fetch(imageUrl);
        const arrayBuffer = await response.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString("base64");

        return base64;
    }

    async saveImage(imageUrl: string, path: string, trim = false): Promise<string> {
        if (!validateUrl(imageUrl)) {
            throw new BadRequestException("URL not valid!");
        }
        const ext = extname(imageUrl).split("?")[0] || ".jpg";
        const filename = `${uuid()}${ext}`;
        const targetDir = join(this.uploadDir, path || "");
        const filePath = join(targetDir, filename);
        console.log(filePath);

        if (!existsSync(targetDir)) {
            console.log("Path does not exist");
            mkdirSync(targetDir, { recursive: true });
        }
        if (trim === true) {
            console.log("Trimming...");
            const trimmedBuffer = await this.trimImage(imageUrl);
            writeFileSync(filePath, trimmedBuffer);
        } else {
            const response = await fetch(imageUrl);
            if (!response.ok || !response.body) {
                throw new BadRequestException("Error downloading image");
            }

            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            const readableStream = Readable.fromWeb(response.body as any);
            await streamPipeline(readableStream, createWriteStream(filePath));
        }

        return `/${path ? `${path}/` : ""}${filename}`;
    }

    async deleteImage(imageName: string, path = ""): Promise<void> {
        const filePath = join(this.uploadDir, path, imageName);

        if (!existsSync(filePath)) {
            throw new NotFoundException("Image not found.");
        }

        try {
            unlinkSync(filePath);
        } catch (err) {
            throw new InternalServerErrorException("Error during image deletion.");
        }
    }
}
