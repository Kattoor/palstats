import palNames from '../../../sav-extractor/out/dumped-game-files/pal-names.json';

export type PalNameKeys = keyof typeof palNames;

export type SaveFilePlayerWrapper = {player: SaveFilePlayer};

export interface SaveFileGuild {
    guildId: string;
    guildName: string;
    guildAdminId: string;
    guildMembers: SaveFilePlayerWrapper[];
}

export interface SaveFileCraftSpeed {
    type: string;
    rank: number;
}

export interface SaveFilePlayer {
    data: { id: string; level: number; exp: number; name: string; };
    pals: {
        characterId: PalNameKeys;
        characterName: string;
        isBoss: boolean;
        isCapturedHuman: boolean;
        gender: string;
        level: number;
        exp: number;
        moves: { equiped: string[]; mastered: string[]; };
        talent: { hp: number; melee: number; shot: number; defense: number; };
        passiveSkillList: string[];
        previousOwnerIds: string[];
        craftSpeed: number;
        craftSpeeds: SaveFileCraftSpeed[];
    }[];
}

export type JsonWithPalNameKeys = Record<PalNameKeys, string>;






export interface PalData {
    exp: number;
    isBoss: boolean;
    name: string;
    description: string;
    isCapturedHuman: boolean;
    characterId: keyof typeof palNames;
    level: number;
    gender: string;
    moves: {
        equiped: PalMove[]
    };
    craftSpeeds: CraftSpeed[];
    talent: Talent;
    passiveSkillList: PassiveSkill[];
}





export interface PassiveSkill {
    name: string;
    description: string;
}

export interface Talent {
    hp: number;
    melee: number;
    shot: number;
    defense: number;
}

export interface CraftSpeed {
    type: string;
    rank: number;
    elementUrl: string;
}

export interface PalMove {
    name: string;
    description: string;
    elementUrl: string;
}
