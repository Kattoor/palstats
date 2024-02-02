import {PalCardDataCraftSpeed} from "../../../../../custom-hooks/usePalCardDataFormatter.ts";

function PalCardBodyCraftSpeed({type, rank, elementUrl}: PalCardDataCraftSpeed) {
    return (
        <div
            className="tooltip flex gap-2 pt-1"
        >
            <img className="h-6 rounded-full tooltip"
                 src={elementUrl}
                 data-pr-tooltip={type}
            />
            <span>{rank}</span>
        </div>
    )
}

export default PalCardBodyCraftSpeed;
