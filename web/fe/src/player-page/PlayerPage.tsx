import {Tooltip} from "primereact/tooltip";
import PalCardsContainer from "./pal-card/PalCardsContainer.tsx";
import {usePlayerGuildContext} from "../custom-contexts/player-guild-context/usePlayerGuildContext.ts";
import {useParams} from "react-router-dom";

function PlayerPage() {
    const {players, pals} = usePlayerGuildContext();
    const {id} = useParams();

    const player = players.find((player) => player.id === id);

    if (!player) {
        return;
    }

    const playerName = player.name;
    const playerPals = pals.filter((pal) => pal.ownerId === id);

    return (
        <>
            <Tooltip target=".tooltip"/>
            <div className="pb-16 text-4xl">Player: {playerName} ({playerPals.length} pals)</div>
            <PalCardsContainer pals={playerPals}/>
        </>
    )
}

export default PlayerPage;
