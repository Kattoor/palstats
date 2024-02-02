import {PalCardDataMove} from "../../../../../custom-hooks/usePalCardDataFormatter.ts";
import PalCardBodyMove from "./PalCardBodyMove.tsx";

function PalCardBodyMovesContainer({moves}: { moves: PalCardDataMove[] }) {
    return (
        <div className="p-2 mt-4 border">
            <p><b>Moves</b></p>
            <div className="w-fit m-auto">
                {
                    moves.map(({name, description, elementUrl}, palMoveIndex) =>
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
