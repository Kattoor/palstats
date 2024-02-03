import PalCard from "./PalCard.tsx";
import {usePalFilterContext} from "../../custom-contexts/pal-filter-context/usePalFilterContext.ts";
import {PalCardData} from "../../custom-hooks/usePalCardDataFormatter.ts";

function PalCardsContainer({pals}: { pals: PalCardData[] }) {
    const {selectedMoveNodeKeys} = usePalFilterContext();

    const checkedTypeFilters = Object.entries(selectedMoveNodeKeys || {}).filter(([key, value]) => !key.includes('.') && value.checked).map(([key]) => key);
    const partiallyCheckedTypeFilters = Object.entries(selectedMoveNodeKeys || {}).filter(([key, value]) => !key.includes('.') && value.partialChecked).map(([key]) => key);
    const moveNameFilters = Object.entries(selectedMoveNodeKeys || {}).filter(([key]) => key.includes('.')).map(([key]) => key.split('.')[1]);

    const palsToDisplay = pals
        .sort((p1, p2) => p2.exp - p1.exp)
        .reduce((acc, curr) => {
            if (curr.moves.some(({type}) => checkedTypeFilters.includes(type))) {
                acc.push(curr);
            } else if (curr.moves.some(({type}) => partiallyCheckedTypeFilters.includes(type))) {
                if (curr.moves.some(({name}) => moveNameFilters.includes(name))) {
                    acc.push(curr);
                }
            }

            return acc;
        }, [] as PalCardData[]);

    return <div className="grid grid-cols-4 gap-4">
        {
            palsToDisplay
                .map((pal, palIndex) => <PalCard pal={pal} key={palIndex}/>)
        }
    </div>
}

export default PalCardsContainer;
