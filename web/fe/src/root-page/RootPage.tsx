import {SaveFileGuild, SaveFilePlayerWrapper} from "../types.ts";
import guilds from "../../../../sav-extractor/out/extracted-data/combined.json";
import {Card} from "primereact/card";
import {useNavigate} from "react-router-dom";
import {usePlayerGuildContext} from "../player-guild-context/usePlayerGuildContext.ts";

const players = guilds
    .reduce(
        (acc, curr: SaveFileGuild) =>
            acc.concat(...curr.guildMembers),
        [] as SaveFilePlayerWrapper[]
    );

function RootPage() {
    const {setSelectedGuild} = usePlayerGuildContext();
    const navigate = useNavigate();

    function getGuildAdminName(adminId: string): string {
        return players.find(({player}) => player.data.id === adminId)?.player.data.name || adminId;
    }

    function onGuildSelected(guild: SaveFileGuild): void {
        setSelectedGuild(guild);
        navigate('/guild');
    }

    return (
        <div className="flex gap-4">
            {
                guilds.map((guild) =>
                    <Card
                        className="cursor-pointer"
                        onClick={() => onGuildSelected(guild)}
                        key={guild.guildId}
                        title={guild.guildName}
                    >
                        <p>Admin: {getGuildAdminName(guild.guildAdminId)}</p>
                        <p><b>{guild.guildMembers.length}</b> member(s)</p>
                    </Card>
                )
            }
        </div>
    )
}

export default RootPage;
