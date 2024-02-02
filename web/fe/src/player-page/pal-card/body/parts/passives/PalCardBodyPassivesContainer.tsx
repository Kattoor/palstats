import PalCardBodyPassive from "./PalCardBodyPassive.tsx";
import {PalCardDataPassiveSkill} from "../../../../../custom-hooks/usePalCardDataFormatter.ts";

function PalCardBodyPassivesContainer({passiveSkillList}: { passiveSkillList: PalCardDataPassiveSkill[] }) {
    return (
        <div className="p-2 mt-4 border">
            <p><b>Passives</b></p>
            <div className="flex flex-wrap max-w-44 gap-2 justify-center">
                {
                    passiveSkillList
                        ?.map(({name, description}, passiveSkillIndex) =>
                            <PalCardBodyPassive name={name} description={description} key={passiveSkillIndex}/>
                        )
                }
            </div>
        </div>
    )
}

export default PalCardBodyPassivesContainer;
