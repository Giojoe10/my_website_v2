import { CACHE_MANAGER, Cache } from "@nestjs/cache-manager";
import { HttpException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Buffer } from "node:buffer";
import { spawn } from "node:child_process";
import { join } from "node:path";
import PQueue from "p-queue";
import { Repository } from "typeorm";
import { PythonResponseDto } from "../../common/dtos/python-response.dto";
import { ImageService } from "../image/image.service";
import { CardResponseDto } from "./dtos/card-response.dto";
import { CreateMtgDeckDto } from "./dtos/create-mtg-deck.dto";
import { GenerateWantDto } from "./dtos/generate-want.dto";
import { StoreCardDto } from "./dtos/store-card.dto";
import { UpdateMtgDeckDto } from "./dtos/update-mtg-deck.dto";
import { MtgDeck } from "./entities/mtg-deck.entity";

type CardJson = {
    id: number;
    idE: string;
    precoMenor: string;
    precoMaior: string;
};

type CardEditions = {
    num: string;
    price: CardEditionPrice;
};

type CardEditionPrice = {
    [key: string]: {
        p: string;
        m: string;
        g: string;
    };
};

const queue = new PQueue({
    concurrency: 1,
    interval: 1000 * 5,
    intervalCap: 1,
});

@Injectable()
export class MtgService {
    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        @InjectRepository(MtgDeck)
        private mtgDeckRepository: Repository<MtgDeck>,

        private readonly imageService: ImageService,
    ) {}

    async generateWant(generateWantDto: GenerateWantDto): Promise<Buffer> {
        const scriptPath = join(__dirname, "..", "..", "..", "scripts", "generate_want_image.py");

        const pythonResponse = await new Promise<PythonResponseDto>((resolve, reject) => {
            const python = spawn("py", [scriptPath]);

            python.stdin.write(JSON.stringify(generateWantDto));
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

        return Buffer.from(pythonResponse.image, "base64");
    }

    async getCard(cardName: string): Promise<CardResponseDto> {
        const parsedCardName = encodeURIComponent(cardName).replaceAll(/\=/g, ":");
        const scryfallUrl = `https://api.scryfall.com/cards/named?fuzzy=${parsedCardName}`;
        const response = await fetch(scryfallUrl);
        if (!response.ok) {
            throw new NotFoundException(`Error fetching card: ${response.statusText}`);
        }
        const data = await response.json();
        const { name } = data;

        if (!data || !name) {
            throw new NotFoundException(`Error fetching card: ${cardName} on Scryfall!`);
        }

        const cacheKey = `mtg:card:${name.toLowerCase().trim().replace(/\s+/g, "_")}`;
        const cachedCard = await this.cacheManager.get<CardResponseDto>(cacheKey);
        if (cachedCard) {
            console.log("Grabing card from cache...");
            return cachedCard;
        }

        const parsedScryfallName = name.replace(" ", "+").split("/")[0].trim();
        const ligamagicUrl = `https://www.ligamagic.com.br/?view=cards/card&card=${parsedScryfallName}`;

        const ligamagicResponse = (await queue.add(() => {
            return fetch(ligamagicUrl);
        })) as Response;

        if (!ligamagicResponse.ok) {
            if (ligamagicResponse.status === 429) {
                throw new HttpException("Ligamagic Cloudflare rate limit achieved", 429);
            }
            throw new NotFoundException(`Error fetching card details from Ligamagic: ${ligamagicResponse.statusText}`);
        }
        const ligamagicPage = await ligamagicResponse.text();
        const cardJson = ligamagicPage.match(/var cardsjson = (\[.+?\]);/);
        const cardEditions = ligamagicPage.match(/var cards_editions = (\[.+?\]);/);
        console.log(cardJson ? "Card JSON found!" : "No card JSON found");
        console.log(cardEditions ? "Card editions found!" : "No card editions found");

        if (!cardJson && !cardEditions) {
            throw new Error("Card not found or invalid response format.");
        }

        let result: CardResponseDto;
        let cardId: number;

        if (cardJson) {
            const ligamagicData = JSON.parse(cardJson[1]);
            const idCount = ligamagicData.reduce((acc, { id }) => {
                acc[id] = (acc[id] || 0) + 1;
                return acc;
            }, {});

            const mostFrequentId = +Object.entries(idCount).reduce((a, b) => (a[1] > b[1] ? a : b))[0];

            cardId = mostFrequentId;

            const prices = ligamagicData
                .map((card: CardJson) => {
                    if (!card.precoMenor && !card.precoMaior) {
                        return null;
                    }
                    return {
                        ligaId: card.idE, // ID da edição
                        minPrice: Number.parseFloat(card.precoMenor),
                        maxPrice: Number.parseFloat(card.precoMaior),
                    };
                })
                .filter((price: CardEditionPrice) => price !== null);

            const cheapestPrice = prices.reduce(
                (min: number, card: { minPrice: number }) => Math.min(min, card.minPrice),
                Number.POSITIVE_INFINITY,
            );

            result = {
                name,
                cardId,
                prices,
                cheapestPrice,
            };
        }
        if (cardEditions) {
            const ligaMagicParam = ligamagicPage.match(/var param = (\{.+?\});/);
            const cardParam = JSON.parse(ligaMagicParam[1]);
            cardId = cardParam.card.id;

            const ligamagicData = JSON.parse(cardEditions[1]);
            const prices = ligamagicData
                .map((card: CardEditions) => {
                    if (!card.price || !Object.values(card.price).some((item) => item.p)) {
                        return null;
                    }
                    return {
                        ligaId: card.num, // ID da edição
                        minPrice: Math.min(
                            ...Object.values(card.price).map((item) =>
                                item.p ? Number.parseFloat(item.p) : Number.POSITIVE_INFINITY,
                            ),
                        ),
                        maxPrice: Math.max(
                            ...Object.values(card.price).map((item) =>
                                item.g ? Number.parseFloat(item.g) : Number.NEGATIVE_INFINITY,
                            ),
                        ),
                    };
                })
                .filter((price: CardEditionPrice) => price !== null);

            const cheapestPrice = prices.reduce(
                (min: number, card: { minPrice: number }) => Math.min(min, card.minPrice),
                Number.POSITIVE_INFINITY,
            );

            result = {
                name,
                cardId,
                prices,
                cheapestPrice,
            };
        }

        await this.cacheManager.set(cacheKey, result, 1000 * 60 * 60 * 6);
        return result;
    }

    async getCards(cardNames: string[]): Promise<CardResponseDto[]> {
        const results: CardResponseDto[] = [];
        for (const name of cardNames) {
            results.push(await this.getCard(name));
        }
        return results;
    }

    async getCardPriceFromStore(cardId: number, storeName: string): Promise<StoreCardDto[]> {
        const cacheKey = `mtg:store:${storeName}:card_id:${cardId}`;
        const cachedPrices = await this.cacheManager.get<StoreCardDto[]>(cacheKey);
        if (cachedPrices) {
            console.log("Grabing card from cache...");
            return cachedPrices;
        }

        const storeBaseUrl = `https://www.${storeName}.com.br/?view=ecom/item&tcg=1&card=`;
        const response = await fetch(storeBaseUrl + cardId);
        const storePage = await response.text();
        const storeDataText = storePage.match(/dataLayer.push\((\{ ?event: ?"view_item",.*\})\)/);
        if (!storeDataText) {
            return [];
        }
        const fixedStoreDataText = storeDataText[1].replace(/([{,]\s*)(\w+)(\s*:)/g, '$1"$2"$3');
        const storeData = JSON.parse(fixedStoreDataText);
        let cardsInStock: StoreCardDto[] = storeData.ecommerce.items;
        cardsInStock = cardsInStock.sort((a, b) => {
            return a.price * (1 - a.discount / 100) - b.price * (1 - b.discount / 100);
        });

        const result: StoreCardDto[] = cardsInStock.map((card) => {
            return {
                price: card.price,
                discount: card.discount,
                quantity: card.quantity,
                finalPrice: Number((card.price * (1 - card.discount / 100)).toFixed(2)),
            };
        });

        await this.cacheManager.set(cacheKey, result, 1000 * 60 * 60 * 6);

        return result;
    }

    async getBestDealFromStore(cardId: number, storeName: string, quantity: number): Promise<StoreCardDto[]> {
        const cardsInStock = await this.getCardPriceFromStore(cardId, storeName);
        if (cardsInStock.length === 0) {
            return [];
        }
        const targetQuantity = quantity || 1;

        const result = [];
        let remaining = targetQuantity;
        for (const card of cardsInStock) {
            if (remaining <= 0) break;
            const usedQuantity = Math.min(card.quantity, remaining);
            result.push({ ...card, quantity: usedQuantity });

            remaining -= usedQuantity;
        }

        return result;
    }

    async getAllDecks(): Promise<MtgDeck[]> {
        return await this.mtgDeckRepository.find();
    }

    async getDeckById(idDeck: number): Promise<MtgDeck> {
        const deck = await this.mtgDeckRepository.findOneBy({ id: idDeck });
        if (!deck) {
            throw new NotFoundException("Deck not found");
        }
        return deck;
    }

    async createDeck(createMtgDeckDto: CreateMtgDeckDto) {
        let coverCard = "";
        if (createMtgDeckDto.coverImageUrl) {
            coverCard = await this.imageService.saveImage(createMtgDeckDto.coverImageUrl, "deckImage");
        } else {
            const parsedCardName = encodeURIComponent(createMtgDeckDto.name).replaceAll(/\=/g, ":");
            const scryfallUrl = `https://api.scryfall.com/cards/named?fuzzy=${parsedCardName}`;
            const response = await fetch(scryfallUrl);
            if (!response.ok) {
                throw new NotFoundException(`Error fetching card: ${response.statusText}`);
            }
            const data = await response.json();
            const imageUrl = data.card_faces ? data.card_faces[0].image_uris.large : data.image_uris.large;
            coverCard = await this.imageService.saveImage(imageUrl, "deckImage");
        }

        const maxOrder = await this.mtgDeckRepository
            .createQueryBuilder("deck")
            .select("MAX(deck.order)", "max")
            .getRawOne();
        const order = (maxOrder.max ?? 0) + 1;

        const newDeck = this.mtgDeckRepository.create({ ...createMtgDeckDto, coverCard, order });
        const deck = await this.mtgDeckRepository.save(newDeck);
        return deck;
    }

    async updateDeck(idDeck: number, updateMtgDeckDto: UpdateMtgDeckDto) {
        const deck = await this.getDeckById(idDeck);
        console.log(updateMtgDeckDto);

        if (updateMtgDeckDto.coverImageUrl) {
            await this.imageService.deleteImage(deck.coverCard.split("/").pop(), "deckImage");
            const newCoverImage = await this.imageService.saveImage(updateMtgDeckDto.coverImageUrl, "deckImage");
            deck.coverCard = newCoverImage;
        }
        Object.assign(deck, { ...updateMtgDeckDto, coverImageUrl: undefined });
        return await this.mtgDeckRepository.save(deck);
    }

    async deleteDeck(idDeck: number) {
        const deck = await this.getDeckById(idDeck);
        await this.imageService.deleteImage(deck.coverCard.split("/").pop(), "deckImage");
        await this.mtgDeckRepository.remove(deck);
    }
}
