import {SaveFilePal, SaveFilePalCraftSpeed} from "../types.ts";
import {usePlayerGuildContext} from "../custom-contexts/player-guild-context/usePlayerGuildContext.ts";

export interface PalCardDataMove {
    name: string;
    description: string;
    elementUrl: string;
}

export type PalCardDataCraftSpeed = SaveFilePalCraftSpeed & { elementUrl: string };

export interface PalCardDataPassiveSkill {
    name: string;
    description: string;
}

interface AdditionalData {
    name: string;
    description: string;
    moves: PalCardDataMove[],
    craftSpeeds: PalCardDataCraftSpeed[],
    passiveSkillList: PalCardDataPassiveSkill[]
}

export type PalCardData =
    Pick<SaveFilePal, 'exp' | 'isCapturedHuman' | 'characterId' | 'level' | 'gender' | 'talent'>
    & AdditionalData

export function usePalCardDataFormatter(pal: SaveFilePal): PalCardData {
    const {palNames, palDescriptions, skillNames, skillDescriptions, activeSkillsData, moveElementUrls, workElementUrls} = usePlayerGuildContext();

    return {
        name: palNames[pal.characterId] || pal.characterId,
        description: palDescriptions[pal.characterId],
        moves: pal.moves.equiped.map((move) => ({
            name: skillNames[`ACTION_SKILL_${move}`],
            description: skillDescriptions[`ACTION_SKILL_${move}`],
            elementUrl: moveElementUrls[activeSkillsData[`EPalWazaID::${move}`].slice(17)]
        })),
        craftSpeeds: pal.craftSpeeds.map((craftSpeed) => ({
            ...craftSpeed,
            elementUrl: workElementUrls[craftSpeed.type]
        })),
        passiveSkillList: pal.passiveSkillList?.map((passiveSkill) => ({
            name: skillNames[`PASSIVE_${passiveSkill}`],
            description: skillDescriptions[passiveSkill]
        })) || [],

        exp: pal.exp,
        isCapturedHuman: pal.isCapturedHuman,
        characterId: pal.characterId,
        level: pal.level,
        gender: pal.gender,
        talent: pal.talent
    }

}