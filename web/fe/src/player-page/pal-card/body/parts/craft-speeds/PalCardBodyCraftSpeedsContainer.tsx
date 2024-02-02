import PalCardBodyCraftSpeed from "./PalCardBodyCraftSpeed.tsx";
import {PalCardDataCraftSpeed} from "../../../../../custom-hooks/usePalCardDataFormatter.ts";
import {Fieldset} from "primereact/fieldset";

function PalCardBodyCraftSpeedsContainer({craftSpeeds}: { craftSpeeds: PalCardDataCraftSpeed[] }) {
    return (
        <Fieldset legend="Crafting" pt={{
            legend: {className: 'py-0'},
            root: {className: 'mt-4'},
            content: {className: 'flex flex-wrap max-w-48 gap-2 justify-center'}
        }}>
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
        </Fieldset>
    )
}

export default PalCardBodyCraftSpeedsContainer;
