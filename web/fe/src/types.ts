import palNames from '../../../sav-extractor/out/dumped-game-files/pal-names.json';

export type PalNameKeys = keyof typeof palNames;

export interface SaveFileGuildMember {
    playerUid: string;
    playerName: string;
}

export interface SaveFileGuild {
    id: string;
    name: string;
    guildAdminUid: string;
    guildMembers: SaveFileGuildMember[];
    baseIds: string[];
    baseCampLevel: number;
}

export interface SaveFilePalCraftSpeed {
    type: string;
    rank: number;
}

export interface SaveFilePlayer {
    id: string;
    level: number;
    exp: number;
    name: string;
}

export interface SaveFilePalMoves {
    equiped: string[];
    mastered: string[]
}

export interface SaveFilePalTalents {
    hp: number;
    melee: number;
    shot: number;
    defense: number;
}

export interface SaveFilePal {
    characterId: PalNameKeys;
    isBoss: boolean;
    isCapturedHuman: boolean;
    gender: string;
    level: number;
    exp: number;
    moves: SaveFilePalMoves;
    talent: SaveFilePalTalents;
    passiveSkillList: string[];
    previousOwnerIds: string[];
    ownerId: string;
    craftSpeed: number;
    craftSpeeds: SaveFilePalCraftSpeed[];
}

export type JsonWithPalNameKeys = Record<PalNameKeys, string>;
