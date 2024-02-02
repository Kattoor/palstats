import {Card} from "primereact/card";
import {SaveFilePal} from "../../types.ts";
import PalCardHeader from "./header/PalCardHeader.tsx";
import PalCardBody from "./body/PalCardBody.tsx";
import {usePalCardDataFormatter} from "../../custom-hooks/usePalCardDataFormatter.ts";

function PalCard({pal}: { pal: SaveFilePal }) {
    const {name, exp, description, isCapturedHuman, characterId, level, gender, moves, craftSpeeds, talent, passiveSkillList} = usePalCardDataFormatter(pal);

    return (
        <Card
            pt={{root: {className: pal.isBoss ? 'bg-[#ff000022]' : null}}}
            className="px-4"
            title={name}
        >
            <PalCardHeader
                exp={exp}
                description={description}
                isCapturedHuman={isCapturedHuman}
                characterId={characterId}
                level={level}
                gender={gender}
            />

            <PalCardBody
                moves={moves}
                craftSpeeds={craftSpeeds}
                talent={talent}
                passiveSkillList={passiveSkillList}
            />
        </Card>
    )
}

export default PalCard;
