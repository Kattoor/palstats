import {Tooltip} from "primereact/tooltip";
import PalCardsContainer from "./pal-card/PalCardsContainer.tsx";
import {usePlayerGuildContext} from "../player-guild-context/usePlayerGuildContext.ts";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";

function PlayerPage() {
    const {selectedGuild, selectedPlayer} = usePlayerGuildContext();
    const navigate = useNavigate();

    const shouldNavigateToRoot = selectedGuild === null || selectedPlayer === null;

    useEffect(() => {
        if (shouldNavigateToRoot) {
            navigate('/');
        }
    }, []);

    if (shouldNavigateToRoot) {
        return null;
    }

    const guildName = selectedGuild.guildName;
    const playerName = selectedPlayer.name;
    const pals = selectedPlayer.pals;

    return (
        <>
            <Tooltip target=".tooltip"/>
            <div className="pb-2 text-4xl">Guild: {guildName}</div>
            <div className="pb-16 text-4xl">Player: {playerName} ({pals.length} pals)</div>
            <PalCardsContainer pals={pals}/>
        </>
    )
}

export default PlayerPage;
