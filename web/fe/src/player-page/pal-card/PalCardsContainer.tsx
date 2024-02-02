import PalCard from "./PalCard.tsx";
import {SaveFilePal} from "../../types.ts";

function PalCardsContainer({pals}: { pals: SaveFilePal[] }) {
    return (
        <div className="flex gap-4 flex-wrap justify-center">
            {
                pals
                    .sort((p1, p2) => p2.exp - p1.exp)
                    .map((pal, palIndex) => <PalCard pal={pal} key={palIndex}/>)
            }
        </div>
    )
}

export default PalCardsContainer;
