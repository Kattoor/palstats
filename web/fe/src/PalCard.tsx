import {Card} from "primereact/card";
import {PalData} from "./types.ts";

export interface PalCardProps {
    guildName: string;
    playerName: string;
    pals: PalData[];
}
function PalCard({guildName, playerName, pals}: PalCardProps) {
    return (
        <>
            <div className="pb-2 text-4xl">Guild: {guildName}</div>
            <div
                className="pb-16 text-4xl">Player: {playerName} ({pals.length} pals)
            </div>
            <div className="flex gap-4 flex-wrap justify-center">
                {
                    pals
                        .sort((p1, p2) => p2.exp - p1.exp)
                        .map((pal, palIndex) =>
                            <Card pt={{root: {className: pal.isBoss ? 'bg-[#ff000022]' : null}}}
                                  className="px-4 color-red" key={palIndex}
                                  title={pal.name}>
                                <img className="h-16 m-auto rounded-full tooltip"
                                     src={"https://raw.githubusercontent.com/Kattoor/palimages/main/pal-icons/t_" + (pal.isCapturedHuman ? 'commonhuman' : pal.characterId) + "_icon_normal.png"}
                                     data-pr-tooltip={pal.description}
                                />
                                <p className="pt-4">Level <b>{pal.level}</b> ({pal.exp} exp)</p>
                                <p>{pal.gender}</p>

                                <div className="p-2 mt-4 border">
                                    <p><b>Moves</b></p>
                                    <div className="w-fit m-auto">
                                        {
                                            pal.moves.equiped.map(({name, description, elementUrl}, palMoveIndex) =>
                                                <div
                                                    className="tooltip flex gap-2 pt-1 w-fit"
                                                    key={palIndex + '-' + palMoveIndex}
                                                    data-pr-tooltip={description}
                                                >
                                                    <img className="h-6 rounded-full tooltip" src={elementUrl}/>
                                                    <span>{name}</span>
                                                </div>
                                            )
                                        }
                                    </div>
                                </div>

                                <div className="p-2 mt-4 border">
                                    <p><b>Crafting</b></p>
                                    <div className="flex flex-wrap max-w-44 gap-2 justify-center">
                                        {
                                            pal.craftSpeeds
                                                .filter(({rank}) => rank !== 0)
                                                .map(({type, elementUrl, rank}, craftSpeedIndex) =>
                                                    <div
                                                        className="tooltip flex gap-2 pt-1"
                                                        key={palIndex + '-' + craftSpeedIndex}
                                                    >
                                                        <img className="h-6 rounded-full tooltip"
                                                             src={elementUrl}
                                                             data-pr-tooltip={type}
                                                        />
                                                        <span>{rank}</span>
                                                    </div>
                                                )
                                        }
                                    </div>
                                </div>

                                <div className="p-2 mt-4 border">
                                    <p><b>Talents</b></p>
                                    <div>
                                        <span className="mr-4">HP: {pal.talent.hp}</span>
                                        <span>Melee: {pal.talent.melee}</span>
                                    </div>
                                    <div className="mt-2">
                                        <span className="mr-4">Shot: {pal.talent.shot}</span>
                                        <span>Defense: {pal.talent.defense}</span>
                                    </div>
                                </div>

                                {pal.passiveSkillList?.length ?
                                    <div className="p-2 mt-4 border">
                                        <p><b>Passives</b></p>
                                        <div className="flex flex-wrap max-w-44 gap-2 justify-center">
                                            {
                                                pal.passiveSkillList
                                                    ?.map(({description, name}, passiveSkillIndex) =>
                                                        <div className="tooltip"
                                                             key={palIndex + '-' + passiveSkillIndex}
                                                             data-pr-tooltip={description}>
                                                            {name}
                                                        </div>
                                                    )
                                            }
                                        </div>
                                    </div>
                                    : null}
                            </Card>
                        )
                }
            </div>
        </>
    )
}

export default PalCard;
