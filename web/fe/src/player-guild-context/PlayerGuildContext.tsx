import {SaveFileGuild} from "../types.ts";
import {createContext, FC, PropsWithChildren, useState} from "react";
import {SelectedPlayer} from "../guild-page/GuildPage.tsx";

interface PlayerGuildContextType {
    selectedGuild: SaveFileGuild | null;
    setSelectedGuild: (guild: SaveFileGuild) => void;
    selectedPlayer: SelectedPlayer | null;
    setSelectedPlayer: (player: SelectedPlayer) => void;
}

export const PlayerGuildContext = createContext<PlayerGuildContextType | null>(null);

export const PlayerGuildProvider: FC<PropsWithChildren> = ({children}) => {
    const [selectedGuild, setSelectedGuild] = useState<SaveFileGuild | null>(null);
    const [selectedPlayer, setSelectedPlayer] = useState<SelectedPlayer | null>(null);

    return (
        <PlayerGuildContext.Provider value={{selectedGuild, setSelectedGuild, selectedPlayer, setSelectedPlayer}}>
            {children}
        </PlayerGuildContext.Provider>
    );
};
