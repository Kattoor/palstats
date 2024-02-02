import {PalCardDataMove} from "../../../../../custom-hooks/usePalCardDataFormatter.ts";
import PalCardBodyMove from "./PalCardBodyMove.tsx";
import {Fieldset} from "primereact/fieldset";

function PalCardBodyMovesContainer({moves}: { moves: PalCardDataMove[] }) {
    return (
        <Fieldset legend="Moves" pt={{
            legend: {className: 'py-0'},
            root: {className: 'mt-4'},
            content: {className: 'flex flex-wrap max-w-48 gap-2 justify-center'}
        }}>
            <div>
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
        </Fieldset>
    )
}

export default PalCardBodyMovesContainer;
