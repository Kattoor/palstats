import {PalData} from "../../../../../types.ts";
import PalCardBodyPassive from "./PalCardBodyPassive.tsx";

type PalCardBodyPassivesContainerProps = Pick<PalData, 'passiveSkillList'>;

function PalCardBodyPassivesContainer({passiveSkillList}: PalCardBodyPassivesContainerProps) {
    return (
        <div className="p-2 mt-4 border">
            <p><b>Passives</b></p>
            <div className="flex flex-wrap max-w-44 gap-2 justify-center">
                {
                    passiveSkillList
                        ?.map(({description, name}, passiveSkillIndex) =>
                            <PalCardBodyPassive name={name} description={description} key={passiveSkillIndex}/>
                        )
                }
            </div>
        </div>
    )
}

export default PalCardBodyPassivesContainer;
