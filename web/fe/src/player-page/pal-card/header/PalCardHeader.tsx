import {PalData} from "../../../types.ts";

type PalCardHeaderProps = Pick<PalData, 'isCapturedHuman' | 'characterId' | 'description' | 'level' | 'exp' | 'gender'>;

function PalCardHeader({isCapturedHuman, characterId, description, level, exp, gender}: PalCardHeaderProps) {
    return (
        <>
            <img className="h-16 m-auto rounded-full tooltip"
                 src={"https://raw.githubusercontent.com/Kattoor/palimages/main/pal-icons/t_" + (isCapturedHuman ? 'commonhuman' : characterId) + "_icon_normal.png"}
                 data-pr-tooltip={description}
            />
            <p className="pt-4">Level <b>{level}</b> ({exp} exp)</p>
            <p>{gender}</p>
        </>
    )
}

export default PalCardHeader;
