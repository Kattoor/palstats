import {PalCardDataPassiveSkill} from "../../../../../custom-hooks/usePalCardDataFormatter.ts";

function PalCardBodyPassive({name, description}: PalCardDataPassiveSkill) {
    return <div className="tooltip" data-pr-tooltip={description}>{name}</div>;
}

export default PalCardBodyPassive;
