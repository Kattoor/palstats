import {SaveFileGuild} from "../types.ts";
import {Card} from "primereact/card";
import {useNavigate} from "react-router-dom";
import {usePlayerGuildContext} from "../custom-contexts/player-guild-context/usePlayerGuildContext.ts";

function RootPage() {
    const {guilds, players} = usePlayerGuildContext();
    const navigate = useNavigate();

    function getGuildAdminName(adminId: string): string {
        return players.find((player) => player.id === adminId)?.name || adminId;
    }

    function onGuildSelected(guild: SaveFileGuild): void {
        console.log('navigating to /guild/' + guild.id);
        navigate(`/guild/${guild.id}`);
    }

    return (
        <div className="flex gap-4">
            {
                guilds.map((guild) =>
                    <Card
                        className="cursor-pointer"
                        onClick={() => onGuildSelected(guild)}
                        key={guild.id}
                        title={guild.name}
                    >
                        <p>Admin: {getGuildAdminName(guild.guildAdminUid)}</p>
                        <p><b>{guild.guildMembers.length}</b> member(s)</p>
                    </Card>
                )
            }
        </div>
    )
}

export default RootPage;
