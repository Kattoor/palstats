import {useState} from 'react'
import './App.css'

import guilds from '../../../sav-extractor/out/extracted-data/combined.json';
import palDescriptions from '../../../sav-extractor/out/dumped-game-files/pal-descriptions.json';
import palNames from '../../../sav-extractor/out/dumped-game-files/pal-names.json';
import skillNames from '../../../sav-extractor/out/dumped-game-files/skill-names.json';
import skillDescriptions from '../../../sav-extractor/out/dumped-game-files/skill-descriptions.json';
import activeSkillsData from '../../../sav-extractor/out/dumped-game-files/active-skills-data.json';

const moveElements = ['Normal', 'Fire', 'Water', 'Electricity', 'Leaf', 'Dark', 'Dragon', 'Earth', 'Ice'];
const moveElementUrls = moveElements
    .map((element, i) => ({
        element,
        url: 'https://raw.githubusercontent.com/Kattoor/palimages/main/pal-element-icons/T_Icon_element_s_0' + i + '.png'
    }))
    .reduce((acc, curr) => {
        acc[curr.element] = curr.url;
        return acc;
    }, {});

const workElements = ['EmitFlame', 'Watering', 'Seeding', 'GenerateElectricity', 'Handcraft', 'Collection', 'Deforest', 'Mining', 'ProductMedicine', 'SomethingPoisonousIdk', 'Cool', 'Transport', 'MonsterFarm', 'WhatEvenIsThisIdk'];
const workElementUrls = workElements
    .map((element, i) => ({
        element,
        url: 'https://raw.githubusercontent.com/Kattoor/palimages/main/pal-work-icons/T_icon_palwork_' + String(i).padStart(2, '0') + '.png'
    }))
    .reduce((acc, curr) => {
        acc[curr.element] = curr.url;
        return acc;
    }, {});

const players = guilds.reduce((acc, curr) => {
    acc.push(...curr.guildMembers);
    return acc;
}, []);
import {Card} from "primereact/card";
import {Tooltip} from "primereact/tooltip";

function App() {
    const [selectedGuild, setSelectedGuild] = useState(null);
    const [selectedPlayer, setSelectedPlayer] = useState(null);

    function getGuildAdminName(adminId) {
        return players.find(({player}) => player.data.id === adminId);
    }

    function getSkillDescription(skillId) {
        let description = skillDescriptions['PASSIVE_' + skillId];

        if (!description) {
            description = skillDescriptions['PASSIVE_PAL_' + skillId]
        }

        if (description) {
            return description;
        }

        if (skillId.includes('Deffence_')) {
            const sign = skillId.split('_').slice(-1)[0].slice(0, -1) === 'down' ? '-' : '+';
            const rank = skillId.slice(-1)[0];
            const percentages = {
                1: '10',
                2: '20'
            };
            return `Defense ${sign}${percentages[rank]}%`;
        }

        if (skillId.includes('Attack_')) {
            const sign = skillId.split('_').slice(-1)[0].slice(0, -1) === 'down' ? '-' : '+';
            const rank = skillId.slice(-1)[0];
            const percentages = {
                1: '10',
                2: '20'
            };
            return `Attack ${sign}${percentages[rank]}%`;
        }

        return skillId;
    }

    return (
        <>
            {!selectedGuild ? <div className="flex gap-4">
                {
                    guilds.map((guild) =>
                        <Card className="cursor-pointer" onClick={() => setSelectedGuild(guild)} key={guild.guildId}
                              title={guild.guildName}>
                            <p>Admin: {getGuildAdminName(guild.guildAdminId).player.data.name}</p>
                            <p><b>{guild.guildMembers.length}</b> member(s)</p>
                        </Card>)
                }
            </div> : null}

            {!selectedPlayer && selectedGuild ?
                <>
                    <div className="pb-16 text-4xl">Guild: {selectedGuild.guildName}</div>
                    <div className="flex gap-4">
                        {
                            selectedGuild.guildMembers.map(({player}) =>
                                <Card className="cursor-pointer" onClick={() => setSelectedPlayer(player)}
                                      key={player.data.id} title={player.data.name}>
                                    <p>Level <b>{player.data.level}</b> ({player.data.exp} exp)</p>
                                    <p><b>{player.pals.length}</b> pals</p>
                                </Card>)
                        }
                    </div>
                </> : null}

            {selectedPlayer ?
                <>
                    <Tooltip target=".tooltip"/>
                    <div className="pb-2 text-4xl">Guild: {selectedGuild.guildName}</div>
                    <div
                        className="pb-16 text-4xl">Player: {selectedPlayer.data.name} ({selectedPlayer.pals.length} pals)
                    </div>
                    <div className="flex gap-4 flex-wrap justify-center">
                        {
                            selectedPlayer.pals
                                .sort((p1, p2) => p2.exp - p1.exp)
                                .map((pal, palIndex) =>
                                    <Card pt={{root: {className: pal.isBoss ? 'bg-[#ff000022]' : null}}}
                                          className="px-4 color-red" key={palIndex} title={palNames[pal.characterId] || pal.characterId}>
                                        <img className="h-16 m-auto rounded-full tooltip"
                                             src={"https://raw.githubusercontent.com/Kattoor/palimages/main/pal-icons/T_" + (pal.isHuman ? 'CommonHuman' : pal.characterId) + "_icon_normal.png"}
                                             data-pr-tooltip={palDescriptions[pal.characterId]}
                                        />
                                        <p className="pt-4">Level <b>{pal.level}</b> ({pal.exp} exp)</p>
                                        <p>{pal.gender}</p>

                                        <div className="p-2 mt-4 border">
                                            <p><b>Moves</b></p>
                                            <div className="w-fit m-auto">
                                                {
                                                    pal.moves.equiped.map((id, palMoveIndex) =>
                                                        <div
                                                            className="tooltip flex gap-2 pt-1 w-fit"
                                                            key={palIndex + '-' + palMoveIndex}
                                                            data-pr-tooltip={skillDescriptions['ACTION_SKILL_' + id]}
                                                        >
                                                            <img className="h-6 rounded-full tooltip"
                                                                 src={moveElementUrls[activeSkillsData['EPalWazaID::' + id].slice(17)]}
                                                            />
                                                            <span>{skillNames['ACTION_SKILL_' + id]}</span>
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
                                                        .map(({type, rank}, craftSpeedIndex) =>
                                                            <div
                                                                className="tooltip flex gap-2 pt-1"
                                                                key={palIndex + '-' + craftSpeedIndex}
                                                            >
                                                                <img className="h-6 rounded-full tooltip"
                                                                     src={workElementUrls[type]}
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
                                                            ?.map((passiveSkillId, passiveSkillIndex) =>
                                                                <div className="tooltip"
                                                                     key={palIndex + '-' + passiveSkillIndex}
                                                                     data-pr-tooltip={getSkillDescription(passiveSkillId)}>
                                                                    {skillNames['PASSIVE_' + passiveSkillId]}
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
                : null}
        </>
    )
}

export default App
