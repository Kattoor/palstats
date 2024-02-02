import {SaveFilePalTalents} from "../../../../../types.ts";

function PalCardBodyTalent({talent}: { talent: SaveFilePalTalents }) {
    return (
        <div className="p-2 mt-4 border">
            <p><b>Talents</b></p>
            <div>
                <span className="mr-4">HP: {talent.hp}</span>
                <span>Melee: {talent.melee}</span>
            </div>
            <div className="mt-2">
                <span className="mr-4">Shot: {talent.shot}</span>
                <span>Defense: {talent.defense}</span>
            </div>
        </div>
    )
}

export default PalCardBodyTalent;
