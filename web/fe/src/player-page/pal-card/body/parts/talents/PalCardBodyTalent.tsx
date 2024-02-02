import {SaveFilePalTalents} from "../../../../../types.ts";
import {Fieldset} from "primereact/fieldset";

function PalCardBodyTalent({talent}: { talent: SaveFilePalTalents }) {
    return <Fieldset legend="Talents" pt={{legend: {className: 'py-0'}, root: {className: 'mt-4'}}}>
        <div>
            <span className="mr-4">HP: {talent.hp}</span>
            <span>Melee: {talent.melee}</span>
        </div>
        <div className="mt-2">
            <span className="mr-4">Shot: {talent.shot}</span>
            <span>Defense: {talent.defense}</span>
        </div>
    </Fieldset>
}

export default PalCardBodyTalent;
