import {Card} from "primereact/card";
import PalCardHeader from "./header/PalCardHeader.tsx";
import PalCardBody from "./body/PalCardBody.tsx";
import {PalCardData} from "../../custom-hooks/usePalCardDataFormatter.ts";

function PalCard({pal}: { pal: PalCardData }) {
    return (
        <Card
            pt={{root: {className: pal.isBoss ? 'bg-[#ff000022]' : null}}}
            className="px-4"
            title={pal.name}
        >
            <PalCardHeader
                exp={pal.exp}
                description={pal.description}
                isCapturedHuman={pal.isCapturedHuman}
                characterId={pal.characterId}
                level={pal.level}
                gender={pal.gender}
            />

            <PalCardBody
                moves={pal.moves}
                craftSpeeds={pal.craftSpeeds}
                talent={pal.talent}
                passiveSkillList={pal.passiveSkillList}
            />
        </Card>
    )
}

export default PalCard;
