import {PalData} from "../../../../../types.ts";
import PalCardBodyCraftSpeed from "./PalCardBodyCraftSpeed.tsx";

type PalCardBodyCraftSpeedsContainerProps = Pick<PalData, 'craftSpeeds'>;

function PalCardBodyCraftSpeedsContainer({craftSpeeds}: PalCardBodyCraftSpeedsContainerProps) {
    return (
        <div className="p-2 mt-4 border">
            <p><b>Crafting</b></p>
            <div className="flex flex-wrap max-w-44 gap-2 justify-center">
                {
                    craftSpeeds
                        .filter(({rank}) => rank !== 0)
                        .map(({type, elementUrl, rank}, craftSpeedIndex) =>
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
