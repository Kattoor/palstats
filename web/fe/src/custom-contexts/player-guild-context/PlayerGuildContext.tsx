import {JsonWithPalNameKeys, SaveFileGuild, SaveFilePal, SaveFilePlayer} from "../../types.ts";
import {createContext, FC, PropsWithChildren} from "react";

import players from '../../../../../sav-extractor/out/extracted-data/players.json';
import guilds from '../../../../../sav-extractor/out/extracted-data/guilds.json';
import pals from '../../../../../sav-extractor/out/extracted-data/pals.json';
import palNames from '../../../../../sav-extractor/out/dumped-game-files/pal-names.json';
import palDescriptions from '../../../../../sav-extractor/out/dumped-game-files/pal-descriptions.json';
import skillDescriptions from '../../../../../sav-extractor/out/dumped-game-files/skill-descriptions.json';
import activeSkillsData from '../../../../../sav-extractor/out/dumped-game-files/active-skills-data.json';
import skillNames from '../../../../../sav-extractor/out/dumped-game-files/skill-names.json';

interface PlayerGuildContextType {
    guilds: SaveFileGuild[];
    players: SaveFilePlayer[];
    pals: SaveFilePal[];
    palNames: JsonWithPalNameKeys;
    palDescriptions: JsonWithPalNameKeys;
    skillDescriptions: Record<string, string>;
    activeSkillsData: Record<string, string>;
    skillNames: Record<string, string>;
    moveElementUrls: Record<string, string>;
    workElementUrls: Record<string, string>;
}

export const PlayerGuildContext = createContext<PlayerGuildContextType | null>(null);

export const PlayerGuildProvider: FC<PropsWithChildren> = ({children}) => {
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

    return (
        <PlayerGuildContext.Provider
            value={{guilds, players, pals, palNames, palDescriptions, skillNames, activeSkillsData, skillDescriptions, workElementUrls, moveElementUrls}}>
            {children}
        </PlayerGuildContext.Provider>
    );
};
