import {PalMove} from "../../../../../types.ts";

type PalCardBodyMoveProps = PalMove;

function PalCardBodyMove({description, elementUrl, name}: PalCardBodyMoveProps) {
    return (
        <div
            className="tooltip flex gap-2 pt-1 w-fit"
            data-pr-tooltip={description}
        >
            <img className="h-6 rounded-full tooltip" src={elementUrl}/>
            <span>{name}</span>
        </div>
    )
}

export default PalCardBodyMove;
