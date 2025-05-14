import PageCard from "./components/PageCard";
import PageTitle from "./components/PageTitle";

export default function Home() {
    return (
        <div>
            <PageTitle image="/images/banners/ranni-wide.jpeg" title="HOME" />
            <div className="flex justify-center gap-4 p-4">
                <PageCard
                    name="Pokémon"
                    description="Cartões para cada um dos times que utilizei nas minhas playthroughs de pokémon."
                    image="/images/banners/pokemon.png"
                    page="/pokemon"
                />
                <PageCard
                    name="Magic: The Gathering"
                    description="Ferramentas para a obtenção de preços e criação de imagens de cartas de Magic The Gathering."
                    image="/images/page-cards/anguished-unmaking.jpg"
                    page="/mtg"
                />
            </div>
        </div>
    );
}
