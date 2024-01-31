import {Card} from "primereact/card";
import {PalData, SaveFileCraftSpeed, SaveFilePlayer} from "../types.ts";

import palDescriptions from '../../../../sav-extractor/out/dumped-game-files/pal-descriptions.json';
import palNames from '../../../../sav-extractor/out/dumped-game-files/pal-names.json';
import skillNames from '../../../../sav-extractor/out/dumped-game-files/skill-names.json';
import skillDescriptions from '../../../../sav-extractor/out/dumped-game-files/skill-descriptions.json';
import activeSkillsData from '../../../../sav-extractor/out/dumped-game-files/active-skills-data.json';
import {useNavigate} from "react-router-dom";
import {usePlayerGuildContext} from "../player-guild-context/usePlayerGuildContext.ts";
import {useEffect} from "react";

export interface SelectedPlayer {
    name: string;
    pals: PalData[];
}

function GuildPage() {
    const {selectedGuild, setSelectedPlayer} = usePlayerGuildContext();
    const navigate = useNavigate();

    const shouldNavigateToRoot = selectedGuild === null;

    useEffect(() => {
        if (shouldNavigateToRoot) {
            navigate('/');
        }
    }, []);

    if (shouldNavigateToRoot) {
        return null;
    }

    const guildMembers = selectedGuild.guildMembers;
    const guildName = selectedGuild.guildName;

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

    function onPlayerSelected(player: SelectedPlayer): void {
        setSelectedPlayer(player);
        navigate('/player');
    }

    return (
        <>
            <div className="pb-16 text-4xl">Guild: {guildName}</div>
            <div className="flex gap-4">
                {
                    guildMembers?.map(({player}) =>
                        <Card className="cursor-pointer"
                              onClick={() => onPlayerSelected(enrichWithPlayerData(player))}
                              key={player.data.id} title={player.data.name}>
                            <p>Level <b>{player.data.level}</b> ({player.data.exp} exp)</p>
                            <p><b>{player.pals.length}</b> pals</p>
                        </Card>)
                }
            </div>
        </>
    )
}

export default GuildPage;
