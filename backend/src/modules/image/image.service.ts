import { BadRequestException, Injectable } from "@nestjs/common";
import { spawn } from "node:child_process";
import { join } from "node:path";
import { PythonResponseDto } from "src/common/dtos/python-response.dto";
import { validateUrl } from "src/common/utils/validateUrl";

@Injectable()
export class ImageService {
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
}
