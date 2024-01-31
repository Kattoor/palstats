import {useContext} from "react";
import {PlayerGuildContext} from "./PlayerGuildContext.tsx";

export const usePlayerGuildContext = () => {
    const context = useContext(PlayerGuildContext);

    if (!context) {
        throw new Error('usePlayerGuildContext must be used inside the UsePlayerGuildContextProvider');
    }

    return context;
};
