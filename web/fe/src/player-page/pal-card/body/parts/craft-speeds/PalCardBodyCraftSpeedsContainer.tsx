import PalCardBodyCraftSpeed from "./PalCardBodyCraftSpeed.tsx";
import {PalCardDataCraftSpeed} from "../../../../../custom-hooks/usePalCardDataFormatter.ts";

function PalCardBodyCraftSpeedsContainer({craftSpeeds}: { craftSpeeds: PalCardDataCraftSpeed[] }) {
    return (
        <div className="p-2 mt-4 border">
            <p><b>Crafting</b></p>
            <div className="flex flex-wrap max-w-44 gap-2 justify-center">
                {
                    craftSpeeds
                        .filter(({rank}) => rank !== 0)
                        .map(({type, rank, elementUrl}, craftSpeedIndex) =>
                            <PalCardBodyCraftSpeed
                                type={type}
                                rank={rank}
                                elementUrl={elementUrl}
                                key={craftSpeedIndex}
                            />
                        )
                }
            </div>
        </div>
    )
}

export default PalCardBodyCraftSpeedsContainer;
