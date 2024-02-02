import PalCardBodyPassive from "./PalCardBodyPassive.tsx";
import {PalCardDataPassiveSkill} from "../../../../../custom-hooks/usePalCardDataFormatter.ts";
import {Fieldset} from "primereact/fieldset";

function PalCardBodyPassivesContainer({passiveSkillList}: { passiveSkillList: PalCardDataPassiveSkill[] }) {
    return (
        <Fieldset legend="Passives" pt={{
            legend: {className: 'py-0'},
            root: {className: 'mt-4'},
            content: {className: 'flex flex-wrap max-w-48 gap-2 justify-center'}
        }}>
            {
                passiveSkillList
                    ?.map(({name, description}, passiveSkillIndex) =>
                        <PalCardBodyPassive name={name} description={description} key={passiveSkillIndex}/>
                    )
            }
        </Fieldset>
    )
}

export default PalCardBodyPassivesContainer;
