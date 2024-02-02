import PalCardBodyMovesContainer from "./parts/moves/PalCardBodyMovesContainer.tsx";
import PalCardBodyTalent from "./parts/talents/PalCardBodyTalent.tsx";
import PalCardBodyPassivesContainer from "./parts/passives/PalCardBodyPassivesContainer.tsx";
import PalCardBodyCraftSpeedsContainer from "./parts/craft-speeds/PalCardBodyCraftSpeedsContainer.tsx";
import {PalCardData} from "../../../custom-hooks/usePalCardDataFormatter.ts";

type PalCardBodyProps = Pick<PalCardData, 'moves' | 'craftSpeeds' | 'talent' | 'passiveSkillList'>;

function PalCardBody({moves, craftSpeeds, talent, passiveSkillList}: PalCardBodyProps) {
    return (
        <>
            <PalCardBodyMovesContainer moves={moves}/>

            <PalCardBodyCraftSpeedsContainer craftSpeeds={craftSpeeds}/>

            <PalCardBodyTalent talent={talent}/>

            {
                passiveSkillList?.length
                    ? <PalCardBodyPassivesContainer passiveSkillList={passiveSkillList}/>
                    : null
            }
        </>
    )
}

export default PalCardBody;
