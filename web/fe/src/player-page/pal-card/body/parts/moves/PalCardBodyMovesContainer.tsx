import {PalData} from "../../../../../types.ts";
import PalCardBodyMove from "./PalCardBodyMove.tsx";

type PalCardBodyMovesContainerProps = Pick<PalData, 'moves'>;

function PalCardBodyMovesContainer({moves}: PalCardBodyMovesContainerProps) {
    return (
        <div className="p-2 mt-4 border">
            <p><b>Moves</b></p>
            <div className="w-fit m-auto">
                {
                    moves.equiped.map(({name, description, elementUrl}, palMoveIndex) =>
                        <PalCardBodyMove
                            name={name}
                            description={description}
                            elementUrl={elementUrl}
                            key={palMoveIndex}
                        />
                    )
                }
            </div>
        </div>
    )
}

export default PalCardBodyMovesContainer;
