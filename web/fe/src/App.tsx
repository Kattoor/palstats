import {useState} from 'react'
import './App.css'
import PalCard from "./PalCard.tsx";
import {Card} from "primereact/card";
import {Tooltip} from "primereact/tooltip";
import {PalData, SaveFileCraftSpeed, SaveFileGuild, SaveFilePlayer, SaveFilePlayerWrapper} from "./types.ts";

import guilds from '../../../sav-extractor/out/extracted-data/combined.json';
import palDescriptions from '../../../sav-extractor/out/dumped-game-files/pal-descriptions.json';
import palNames from '../../../sav-extractor/out/dumped-game-files/pal-names.json';
import skillNames from '../../../sav-extractor/out/dumped-game-files/skill-names.json';
import skillDescriptions from '../../../sav-extractor/out/dumped-game-files/skill-descriptions.json';
import activeSkillsData from '../../../sav-extractor/out/dumped-game-files/active-skills-data.json';

const gitImagePath = 'https://raw.githubusercontent.com/Kattoor/palimages/main/';

const moveElements = ['Normal', 'Fire', 'Water', 'Electricity', 'Leaf', 'Dark', 'Dragon', 'Earth', 'Ice'];
const moveElementUrls = moveElements
    .map(
        (element, i) =>
            ({element, url: `${gitImagePath}/pal-element-icons/T_Icon_element_s_0${i}.png`})
    )
    .reduce(
        (acc, curr) =>
            Object.assign(acc, {[curr.element]: curr.url}),
        {} as Record<string, string>
    );

const workElements = ['EmitFlame', 'Watering', 'Seeding', 'GenerateElectricity', 'Handcraft', 'Collection', 'Deforest', 'Mining', 'ProductMedicine', 'SomethingPoisonousIdk', 'Cool', 'Transport', 'MonsterFarm', 'WhatEvenIsThisIdk'];
const workElementUrls = workElements
    .map(
        (element, i) =>
            ({element, url: `${gitImagePath}/pal-work-icons/T_icon_palwork_${String(i).padStart(2, '0')}.png`})
    )
    .reduce(
        (acc, curr) =>
            Object.assign(acc, {[curr.element]: curr.url}),
        {} as Record<string, string>
    );

const players = guilds
    .reduce(
        (acc, curr: SaveFileGuild) =>
            acc.concat(...curr.guildMembers),
        [] as SaveFilePlayerWrapper[]
    );

interface SelectedPlayer {
    name: string;
    pals: PalData[];
}

function App() {
    const [selectedGuild, setSelectedGuild] = useState<SaveFileGuild | null>(null);
    const [selectedPlayer, setSelectedPlayer] = useState<SelectedPlayer | null>(null);

    function getGuildAdminName(adminId: string): string {
        return players.find(({player}) => player.data.id === adminId)?.player.data.name || adminId;
    }

    function enrichWithPlayerData(player: SaveFilePlayer): SelectedPlayer {
        return {
            name: player.data.name,
            pals: player.pals.map((pal) => ({
                name: palNames[pal.characterId] || pal.characterId,
                level: pal.level,
                exp: pal.exp,
                gender: pal.gender,
                isBoss: pal.isBoss,
                characterId: pal.characterId,
                isCapturedHuman: pal.isCapturedHuman,
                description: palDescriptions[pal.characterId],
                moves: {
                    equiped: pal.moves.equiped.map((id: string) => ({
                        description: skillDescriptions['ACTION_SKILL_' + id],
                        elementUrl: moveElementUrls[activeSkillsData['EPalWazaID::' + id].slice(17)],
                        name: skillNames['ACTION_SKILL_' + id]
                    }))
                },
                craftSpeeds: pal.craftSpeeds.map(({type, rank}: SaveFileCraftSpeed) => ({
                    rank,
                    type,
                    elementUrl: workElementUrls[type]
                })),
                talent: {
                    hp: pal.talent.hp,
                    melee: pal.talent.melee,
                    shot: pal.talent.shot,
                    defense: pal.talent.defense
                },
                passiveSkillList: pal.passiveSkillList?.map((passiveSkillId: string) => ({
                    name: skillNames['PASSIVE_' + passiveSkillId],
                    description: skillDescriptions[passiveSkillId]
                }))
            }))
        };
    }

    return (
        <>
            {!selectedGuild ? <div className="flex gap-4">
                {
                    guilds.map((guild) =>
                        <Card className="cursor-pointer" onClick={() => setSelectedGuild(guild)} key={guild.guildId}
                              title={guild.guildName}>
                            <p>Admin: {getGuildAdminName(guild.guildAdminId)}</p>
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
                                <Card className="cursor-pointer"
                                      onClick={() => setSelectedPlayer(enrichWithPlayerData(player))}
                                      key={player.data.id} title={player.data.name}>
                                    <p>Level <b>{player.data.level}</b> ({player.data.exp} exp)</p>
                                    <p><b>{player.pals.length}</b> pals</p>
                                </Card>)
                        }
                    </div>
                </> : null}

            {selectedGuild && selectedPlayer ?
                <>
                    <Tooltip target=".tooltip"/>
                    <PalCard
                        guildName={selectedGuild.guildName}
                        playerName={selectedPlayer.name}
                        pals={selectedPlayer.pals}
                    ></PalCard>
                </>
                : null}
        </>
    )
}

export default App
