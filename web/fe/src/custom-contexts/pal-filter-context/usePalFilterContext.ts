import {useContext} from "react";
import {PalFilterContext} from "./PalFilterContext.tsx";

export const usePalFilterContext = () => {
    const context = useContext(PalFilterContext);

    if (!context) {
        throw new Error('usePalFilterContext must be used inside the UsePalFilterProvider');
    }

    return context;
};
