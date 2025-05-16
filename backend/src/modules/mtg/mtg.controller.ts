import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post, Query, Res } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiProduces, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { CardResponseDto } from "./dtos/card-response.dto";
import { CreateMtgDeckDto } from "./dtos/create-mtg-deck.dto";
import { DeckPriceResponse } from "./dtos/deck-price-response.dto";
import { GenerateWantDto } from "./dtos/generate-want.dto";
import { StoreCardDto } from "./dtos/store-card.dto";
import { UpdateMtgDeckDto } from "./dtos/update-mtg-deck.dto";
import { MtgDeck } from "./entities/mtg-deck.entity";
import { MtgService } from "./mtg.service";

@ApiTags("Magic: The Gathering")
@Controller("mtg")
export class MtgController {
    constructor(private readonly mtgService: MtgService) {}

    //#region @Decorators
    @ApiOperation({
        summary: "Generate card list image",
        description:
            "This endpoint receives a set of card data and passes it to a Python script that generates an image based on the provided information. The result is returned as a binary buffer containing the image, which can be used directly for display or storage.",
    })
    @ApiProduces("image/png")
    @ApiResponse({
        status: 201,
        description: "Image generated successfully",
        content: {
            "image/png": {
                schema: {
                    type: "string",
                    format: "binary",
                },
            },
        },
    })
    //#endregion
    @Post("want")
    async generateWant(@Body() cards: GenerateWantDto, @Res({ passthrough: true }) res: Response) {
        const imageBuffer = await this.mtgService.generateWant(cards);
        res.setHeader("Content-Type", "image/png");
        res.send(imageBuffer);
    }

    //#region @Decorators
    @ApiOperation({
        summary: "Retrieve card data",
        description:
            "This endpoint accepts a Magic: The Gathering card name as input and returns information about the card, including its name, edition prices, and the lowest available price. It fetches data from the Scryfall API using fuzzy search and attempts to enrich it with pricing information from Ligamagic. The result is cached for 6 hours to improve performance.",
    })
    @ApiResponse({
        status: 200,
        description: "Card data successfully retrieved",
        type: CardResponseDto,
    })
    @ApiResponse({
        status: 404,
        description: "Card not found or no valid price data available",
    })
    @ApiResponse({
        status: 500,
        description: "Error retrieving or parsing data from external sources",
    })
    @ApiResponse({
        status: 429,
        description: "LigaMagic's Cloudflare blocked the API",
    })
    @ApiParam({
        name: "cardName",
        type: String,
        required: true,
        description: "Name of the Magic: The Gathering card to search for (fuzzy match supported)",
    })
    //#endregion
    @Get("card/:cardName")
    getCard(@Param("cardName") cardName: string) {
        return this.mtgService.getCard(cardName);
    }

    //#region @Decorators
    @ApiOperation({
        summary: "Retrieve multiple card data",
        description:
            "This endpoint receives an array of card names and returns price data for each card. For each name, it delegates the fetching and parsing logic to the getCard method, which pulls data from Scryfall and Ligamagic. All results are returned in a list, and individual results may be cached to improve performance.",
    })
    @ApiQuery({
        name: "cardNames",
        type: [String],
        required: true,
        description: "List of card names to search for",
    })
    @ApiResponse({
        status: 200,
        description: "List of card data successfully retrieved",
        type: CardResponseDto,
        isArray: true,
    })
    @ApiResponse({
        status: 404,
        description: "One or more cards not found or returned no valid price data",
    })
    @ApiResponse({
        status: 500,
        description: "Error retrieving or parsing data from external sources",
    })
    @ApiResponse({
        status: 429,
        description: "LigaMagic's Cloudflare blocked the API",
    })
    //#endregion
    @Get("cards")
    getCards(@Query("cardNames") cardNames: string[]) {
        return this.mtgService.getCards(cardNames);
    }

    //#region @Decorators
    @ApiOperation({
        summary: " Retrieve card price from store",
        description:
            "This endpoint resolves the card using the provided cardName and fetches its price from the specified storeName. It combines card data from external APIs and store-specific pricing logic to return up-to-date price information sorted by the price with discounts already applied.",
    })
    @ApiParam({
        name: "cardName",
        type: String,
        description: "Name of the Magic: The Gathering card to search for",
        required: true,
    })
    @ApiParam({
        name: "storeName",
        type: String,
        description: "Store identifier to fetch the price from (as shown in the store's url)",
        required: true,
    })
    @ApiResponse({
        status: 200,
        description: "Price data retrieved successfully",
        type: [StoreCardDto],
        example: [
            {
                price: 2.9,
                discount: 1.0,
                quantity: 4,
                finalPrice: 2.87,
            },
        ],
    })
    //#endregion
    @Get("card/:cardName/store/:storeName")
    async getCardPriceFromStore(@Param("cardName") cardName: string, @Param("storeName") storeName: string) {
        const card = await this.getCard(cardName);
        return this.mtgService.getCardPriceFromStore(card.cardId, storeName);
    }

    //#region @Decorators
    @ApiOperation({
        summary: "Retrieve best deal for card amount from store",
        description:
            "This endpoint resolves the card using the provided cardName and fetches its price from the specified storeName. It combines card data from external APIs and store-specific pricing logic to return the amount of cards that make up the best deal for the quantity provided.",
    })
    @ApiParam({
        name: "cardName",
        type: String,
        description: "Name of the Magic: The Gathering card to search for",
        required: true,
    })
    @ApiParam({
        name: "storeName",
        type: String,
        description: "Store identifier to fetch the price from (as shown in the store's url)",
        required: true,
    })
    @ApiQuery({
        name: "quantity",
        type: Number,
        description: "The amount of the specified card to be bought. If not provided, the quantity will default to 1",
        default: 1,
    })
    @ApiResponse({
        status: 200,
        description: "Price data retrieved successfully",
        type: [StoreCardDto],
        example: [
            {
                price: 2.9,
                discount: 1.0,
                quantity: 2,
                finalPrice: 2.87,
            },
        ],
    })
    //#endregion
    @Get("buy/:cardName/store/:storeName")
    async getBestDealFromStore(
        @Param("cardName") cardName: string,
        @Param("storeName") storeName: string,
        @Query("quantity", ParseIntPipe) quantity: number,
    ) {
        const card = await this.getCard(cardName);
        return this.mtgService.getBestDealFromStore(card.cardId, storeName, quantity);
    }

    //#region @Decorators
    @ApiOperation({
        summary: "Get all decks",
        description: "Returns a list of all decks in the database.",
        tags: ["Magic: The Gathering | Decks"],
    })
    @ApiResponse({
        status: 200,
        description: "Data for decks retrieved successfuly",
        type: [MtgDeck],
        example: [
            {
                id: 1,
                name: "Breya, Etherium Shaper",
                archidektUrl: "https://archidekt.com/decks/6656210",
                ligamagicUrl: "https://www.ligamagic.com.br/?view=dks/deck&id=7273952",
                coverCard: "/deckImage/b3f8898f-1943-4151-8742-942fe20425d8.png",
            },
        ],
    })
    //#endregion
    @Get("deck")
    async getAllDecks() {
        return await this.mtgService.getAllDecks();
    }

    //#region @Decorators
    @ApiOperation({
        summary: "Get deck",
        description: "Retrieves the details of a specific deck based on the provided ID.",
        tags: ["Magic: The Gathering | Decks"],
    })
    @ApiResponse({
        status: 200,
        description: "Deck data retrieved successfuly",
        type: MtgDeck,
        example: {
            id: 1,
            name: "Breya, Etherium Shaper",
            archidektUrl: "https://archidekt.com/decks/6656210",
            ligamagicUrl: "https://www.ligamagic.com.br/?view=dks/deck&id=7273952",
            coverCard: "/deckImage/b3f8898f-1943-4151-8742-942fe20425d8.png",
        },
    })
    @ApiResponse({
        status: 404,
        description: "Deck not found!",
    })
    //#endregion
    @Get("deck/:idDeck")
    async getDeckById(@Param("idDeck", ParseIntPipe) idDeck: number) {
        return await this.mtgService.getDeckById(+idDeck);
    }

    //#region @Decorators
    @ApiOperation({
        summary: "Create deck",
        description: "Creates a new deck using the data provided in the request body.",
        tags: ["Magic: The Gathering | Decks"],
    })
    @ApiResponse({
        status: 200,
        description: "Deck created succesfully",
        type: MtgDeck,
        example: {
            id: 1,
            name: "Breya, Etherium Shaper",
            archidektUrl: "https://archidekt.com/decks/6656210",
            ligamagicUrl: "https://www.ligamagic.com.br/?view=dks/deck&id=7273952",
            coverCard: "/deckImage/b3f8898f-1943-4151-8742-942fe20425d8.png",
        },
    })
    @HttpCode(200)
    //#endregion
    @Post("deck")
    async createDeck(@Body() createMtgDeckDto: CreateMtgDeckDto) {
        return await this.mtgService.createDeck(createMtgDeckDto);
    }

    //#region @Decorators
    @ApiOperation({
        summary: "Update deck",
        description:
            "Updates an existing deck with the given ID using the provided data. If updating the cover image, deletes the previous image to save the new one.",
        tags: ["Magic: The Gathering | Decks"],
    })
    @ApiResponse({
        status: 200,
        description: "Deck updated succesfully",
        type: MtgDeck,
        example: {
            id: 1,
            name: "Breya, Etherium Shaper",
            archidektUrl: "https://archidekt.com/decks/6656210",
            ligamagicUrl: "https://www.ligamagic.com.br/?view=dks/deck&id=7273952",
            coverCard: "/deckImage/b3f8898f-1943-4151-8742-942fe20425d8.png",
        },
    })
    @ApiResponse({
        status: 404,
        description: "Deck not found!",
    })
    //#endregion
    @Patch("deck/:idDeck")
    async updateDeck(@Param("idDeck", ParseIntPipe) idDeck: number, @Body() updateMtgDeckDto: UpdateMtgDeckDto) {
        return await this.mtgService.updateDeck(+idDeck, updateMtgDeckDto);
    }

    //#region @Decorators
    @ApiOperation({
        summary: "Delete deck",
        description:
            "Deletes a deck from the datebase using the specified ID. Also deletes the deck's cover image from the filesystem.",
        tags: ["Magic: The Gathering | Decks"],
    })
    @ApiResponse({
        status: 200,
        description: "Deck deleted succesfully",
    })
    @ApiResponse({
        status: 404,
        description: "Deck not found!",
    })
    //#endregion
    @Delete("deck/:idDeck")
    async deleteDeck(@Param("idDeck", ParseIntPipe) idDeck: number) {
        return await this.mtgService.deleteDeck(+idDeck);
    }

    //#region @Decorators
    @ApiOperation({
        summary: "Get deck price",
        description: "Retrieves the price of a specific deck based on the provided ID.",
        tags: ["Magic: The Gathering | Decks"],
    })
    @ApiParam({
        name: "idDeck",
        type: Number,
        description: "Database id of the deck to search the price for",
        required: true,
    })
    @ApiResponse({
        status: 200,
        description: "Deck price retrieved successfuly",
        type: DeckPriceResponse,
        example: {
            id: 7273952,
            price: 1427.31,
        },
    })
    @ApiResponse({
        status: 400,
        description: "Please provide the deck id!",
    })
    @ApiResponse({
        status: 404,
        description: "Deck not found!",
    })
    @ApiResponse({
        status: 422,
        description: "Deck found, but is missing the ligamagic url!",
    })
    //#endregion
    @Get("deck/price/:idDeck")
    async getDeckPrice(@Param("idDeck", ParseIntPipe) idDeck: number) {
        return await this.mtgService.getDeckPrice(+idDeck);
    }
}
