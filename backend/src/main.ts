import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { apiReference } from "@scalar/nestjs-api-reference";
import { join } from "node:path";
import { AppModule } from "./app.module";

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    const config = new DocumentBuilder()
        .setTitle("Giojoe API")
        .setDescription("API documentation for Giojoe")
        .setVersion("1.0")
        .addTag(
            "Magic: The Gathering",
            "The MtgController provides endpoints for interacting with Magic: The Gathering card data, including generating card list images, retrieving card details, and fetching pricing information from external sources.\n\nNames and images are retrieved from `Scryfall` while prices and ids are retrieved from `LigaMagic`",
        )
        .addTag("Magic: The Gathering | Decks")
        .addTag("Pokémon")
        .addTag("Pokémon | Team")
        .addTag("Image Manipulation")
        .build();

    const document = SwaggerModule.createDocument(app, config);

    app.use(
        "/docs",
        apiReference({
            content: document,
            hideDownloadButton: true,
            defaultHttpClient: { targetKey: "http", clientKey: "http1.1" },
            metaData: {
                title: "Giojoe API Docs",
                description: "Documentação da API do Giojoe",
            },
        }),
    );
    app.useGlobalPipes(new ValidationPipe());
    app.useStaticAssets(join(__dirname, "..", "public"));
    await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
