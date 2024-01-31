import {PassiveSkill} from "../../../../../types.ts";

type PalCardBodyPassiveProps = PassiveSkill;

function PalCardBodyPassive({description, name}: PalCardBodyPassiveProps) {
    return <div className="tooltip" data-pr-tooltip={description}>{name}</div>;
}

export default PalCardBodyPassive;
