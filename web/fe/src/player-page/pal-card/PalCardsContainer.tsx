import PalCard from "./PalCard.tsx";
import {SelectedPlayer} from "../../guild-page/GuildPage.tsx";

type PalCardsContainerProps = Pick<SelectedPlayer, 'pals'>;

function PalCardsContainer({pals}: PalCardsContainerProps) {
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
