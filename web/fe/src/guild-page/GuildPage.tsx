import {Card} from "primereact/card";
import {useNavigate, useParams} from "react-router-dom";
import {usePlayerGuildContext} from "../custom-contexts/player-guild-context/usePlayerGuildContext.ts";
import {SaveFilePal, SaveFilePlayer} from "../types.ts";

function GuildPage() {
    const {guilds, players, pals} = usePlayerGuildContext();
    const navigate = useNavigate();
    const {id} = useParams();

    const guild = guilds.find((guild) => guild.id === id);

    if (!guild) {
        return;
    }

    const guildMembers = guild.guildMembers.map(({playerUid}) => players.find((player) => player.id === playerUid));
    const guildName = guild.name;

    function onPlayerSelected(player: SaveFilePlayer): void {
        navigate(`/player/${player.id}`);
    }

    function findPlayerPals(player: SaveFilePlayer): SaveFilePal[] {
        return pals.filter((pal) => pal.ownerId === player.id);
    }

    return (
        <>
            <div className="pb-16 text-4xl">Guild: {guildName}</div>
            <div className="flex gap-4">
                {
                    guildMembers
                        .map(
                            (player) =>
                                player
                                    ? <Card className="cursor-pointer"
                                            onClick={() => onPlayerSelected(player)}
                                            key={player.id} title={player.name}>
                                        <p>Level <b>{player.level}</b> ({player.exp} exp)</p>
                                        <p><b>{findPlayerPals(player).length}</b> pals</p>
                                    </Card>
                                    : null
                        )
                }
            </div>
        </>
    )
}

export default GuildPage;
