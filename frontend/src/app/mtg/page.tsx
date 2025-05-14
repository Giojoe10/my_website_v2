import PageCard from "../components/PageCard";
import PageTitle from "../components/PageTitle";

export default function Mtg() {
    return (
        <div>
            <PageTitle image="/images/banners/ashling-wide.png" title="MTG" />
            <div className="flex justify-center gap-4 p-4">
                <PageCard
                    name="Busca de Preços"
                    description="Busca de preços de cartas ou listas de MTG na LigaMagic."
                    image="/images/page-cards/smothering-tithe.jpg"
                    page="/mtg/price"
                />
                <PageCard
                    name="Gerador de Want"
                    description="Gerador de imagem de lista de cartas, para compartilhamento de wants."
                    image="/images/page-cards/merchant-scroll.jpg"
                    page="/mtg/want"
                />
                <PageCard
                    name="Meus Decks"
                    description="Lista dos meus decks com o link para Archidekt, Ligamagic e gerador de want por tag."
                    image="/images/page-cards/vorthos.jpg"
                    page="/mtg/decks"
                />
            </div>
        </div>
    );
}
