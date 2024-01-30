const fs = require('fs');

class UsefulDataMapper {
    #worldSaveData;

    constructor(worldSaveData) {
        this.#worldSaveData = worldSaveData;
    }

    getPallDefinitions() {
        const palMonsterParameter = JSON.parse(fs.readFileSync('./dumped-game-files/DT_PalMonsterParameter.json', 'utf-8'));
        const palNameText = JSON.parse(fs.readFileSync('./dumped-game-files/DT_PalNameText.json', 'utf-8'));

        const palNameReferenceTable = Object.entries(palNameText[0]['Rows'])
            .map(([key, value]) => ({
                key: key.replace('PAL_NAME_', '').toLowerCase(),
                value: value['TextData']['SourceString']
            }))
            .reduce((acc, curr) => Object.assign(acc, {[curr.key]: curr.value}), {});

        return Object.values(palMonsterParameter[0]['Rows'])
            .filter((pal) => pal['IsBoss'] === false)
            .map((pal) => {
                const id = pal['BPClass'].toLowerCase();
                return {
                    id,
                    name: palNameReferenceTable[id],
                    elementTypes: [pal['ElementType1'], pal['ElementType2']].map((value) => value.split('::')[1]).filter((value) => value !== 'None'),
                    workSuitabilities: Object.entries(pal)
                        .filter(([key, value]) => key.startsWith('WorkSuitability') && value > 0)
                        .map(([key, value]) => ({key: key.split('_')[1], value})),
                    passiveSkills: Object.entries(pal)
                        .filter(([key, value]) => key.startsWith('PassiveSkill') && value !== 'None')
                        .map(([_, value]) => value)

                }
            })
            .reduce((acc, curr) => Object.assign(acc, {[curr.id]: curr}), {});
    }

    getPlayersAndPals() {
        const characterSaveParameterMap = this.#worldSaveData.value['CharacterSaveParameterMap'].value;
        const players = {};
        const pals = [];

        for (let characterSaveParameter of characterSaveParameterMap) {
            const saveParameter = characterSaveParameter.value['RawData'].value.object['SaveParameter'].value;
            if (saveParameter['IsPlayer']?.value) {
                const playerId = characterSaveParameter.key['PlayerUId'].value;
                players[playerId] = {userData: this.formatRecord(saveParameter), pals: []};
            } else {
                pals.push(this.formatRecord(saveParameter));
            }
        }

        for (let pal of pals) {
            const ownerId = pal['OwnerPlayerUId'];
            players[ownerId].pals.push(pal);
        }

        return {players, pals};
    }

    getGuilds() {
        return this.#worldSaveData.value['GroupSaveDataMap'].value
            .filter((value) => value.value['RawData'].value.groupType === 'EPalGroupType::Guild')
            .map(({key, value}) => ({key, data: this.formatRecord(value)}));
    }

    formatRecord(obj) {
        const newObj = {};
        if (Buffer.isBuffer(obj)) {
            return obj;
        } else if (Array.isArray(obj)) {
            return obj.map((value) => this.formatRecord(value));
        } else if (typeof obj === 'object') {
            if (obj.value !== undefined) {
                if (obj.value.values && typeof obj.value.values !== 'function') {
                    if (obj.arrayType === 'ByteProperty') {
                        return obj.value.values.join(',');
                    } else {
                        return obj.value.values.map((innerValue) => this.formatRecord(innerValue));
                    }
                } else if (obj.value['Value']) {
                    return this.formatRecord(obj.value['Value'].value);
                } else if (Buffer.isBuffer(obj.value)) {
                    return this.formatRecord(obj.value);
                } else if (obj.value.value) {
                    return this.formatRecord(obj.value.value);
                } else {
                    return this.formatRecord(obj.value);
                }
            } else {
                Object.entries(obj).forEach(([key, value]) => {
                    newObj[key] = this.formatRecord(value);
                });
            }
        } else {
            return obj;
        }
        return newObj;
    }

    combineGuildsAndPlayers(allPlayers, allGuilds, palDefinitions) {
        return allGuilds.map((guild) => {
            const guildId = guild.key;
            const {guildName, adminPlayerUid, players} = guild.data['RawData'];
            return {
                guildId,
                guildName,
                guildAdminId: adminPlayerUid,
                guildMembers: players.map((player) => ({...this.getPlayerById(allPlayers, palDefinitions, player.playerUid)}))
            };
        });
    }

    getPlayerById(players, palDefinitions, id) {
        const {userData, pals} = players[id];

        const playerData = {
            id,
            level: userData['Level'],
            exp: userData['Exp'],
            name: userData['NickName']
        };

        const palData = pals.map((pal) => {
            const isBoss = pal['CharacterID'].startsWith('BOSS_') || pal['CharacterID'].startsWith('Boss_');
            const characterId = pal['CharacterID'].slice(isBoss ? 5 : 0).toLowerCase();
            return {
                characterId: characterId,
                characterName: palDefinitions[characterId]?.name || characterId,
                isBoss,
                isCapturedHuman: pal['MasteredWaza'].length === 1 && pal['MasteredWaza'][0] === 'EPalWazaID::Human_Punch',
                gender: pal['Gender']?.split('::')[1],
                level: pal['Level'] || 1,
                exp: pal['Exp'] || 0,
                moves: {
                    equiped: pal['EquipWaza'].map((move) => move.split('::')[1]),
                    mastered: pal['MasteredWaza'].map((move) => move.split('::')[1])
                },
                talent: {
                    hp: pal['Talent_HP'],
                    melee: pal['Talent_Melee'],
                    shot: pal['Talent_Shot'],
                    defense: pal['Talent_Defense']
                },
                passiveSkillList: pal['PassiveSkillList'],
                previousOwnerIds: pal['OldOwnerPlayerUIds'],
                craftSpeed: pal['CraftSpeed'],
                craftSpeeds: pal['CraftSpeeds'].map((record) => ({
                    type: record['WorkSuitability'].split('::')[1],
                    rank: record['Rank']
                })),
            };
        });

        return {player: {data: playerData, pals: palData}};
    }

    transformDumpedGameFiles() {
        const palNames = Object.entries(JSON.parse(fs.readFileSync('./dumped-game-files/DT_PalNameText.json', 'utf-8'))[0]['Rows'])
            .map(([key, value]) => ({
                key: key.replace('PAL_NAME_', '').toLowerCase(),
                value: value['TextData']['LocalizedString']
            }))
            .reduce((acc, curr) => {
                acc[curr.key] = curr.value;
                return acc;
            }, {});

        const skillNames = Object.entries(JSON.parse(fs.readFileSync('./dumped-game-files/DT_SkillNameText.json', 'utf-8'))[0]['Rows'])
            .map(([key, value]) => ({key, value: value['TextData']['LocalizedString']}))
            .reduce((acc, curr) => {
                acc[curr.key] = curr.value;
                return acc;
            }, {});

        const activeSkillsData = Object.entries(JSON.parse(fs.readFileSync('./dumped-game-files/DT_WazaDataTable.json', 'utf-8'))[0]['Rows'])
            .map(([key, value]) => ({
                key: value['WazaType'],
                value: value['Element']
            }))
            .reduce((acc, curr) => {
                acc[curr.key] = curr.value;
                return acc;
            }, {});

        const palDescriptions = Object.entries(JSON.parse(fs.readFileSync('./dumped-game-files/DT_PalLongDescriptionText.json', 'utf-8'))[0]['Rows'])
            .map(([key, value]) => ({
                key: key.replace('PAL_LONG_DESC_', '').toLowerCase(),
                value: value['TextData']['LocalizedString']
            }))
            .reduce((acc, curr) => {
                curr.value = curr.value.replace(/<characterName id=\|(.*)\|\/>/, (_, name) => palNames[name]);
                acc[curr.key] = curr.value;
                return acc;
            }, {});

        const skillDescriptionsLookup = JSON.parse(fs.readFileSync('./dumped-game-files/DT_SkillDescText.json', 'utf-8'))[0]['Rows'];

        const passiveSkills = Object.entries(JSON.parse(fs.readFileSync('./dumped-game-files/DT_PassiveSkill_Main.json', 'utf-8'))[0]['Rows'])
            .map(([key, value]) => {
                const effects = [
                    {value: value['EffectValue1'], type: value['EffectType1']},
                    {value: value['EffectValue2'], type: value['EffectType2']},
                    {value: value['EffectValue3'], type: value['EffectType3']}
                ];

                const hasDescription = value['OverrideDescMsgID'] !== 'None';

                const description = hasDescription
                    ? this.getDescription(skillDescriptionsLookup, value, effects, palNames)
                    : this.buildDescription(skillDescriptionsLookup, value, effects, palNames);

                return {key, description};
            })
            .reduce((acc, curr) => Object.assign(acc, {[curr.key]: curr.description}), {});

        const activeSkills = Object.entries(skillDescriptionsLookup)
            .filter(([key]) => key.startsWith('ACTION_SKILL_'))
            .map(([key, value]) => ({
                key,
                description: value['TextData']['SourceString']
                    .replace(/<characterName id=\|(.*)\|\/>/, (_, name) => palNames[name.toLowerCase()])
                    .replace(/<Num(Blue|Red)_\d*>(.*)<\/>/, '$2')
            }))
            .reduce((acc, curr) => Object.assign(acc, {[curr.key]: curr.description}), {});

        const skillDescriptions = {...passiveSkills, ...activeSkills};

        return {palNames, skillNames, palDescriptions, skillDescriptions, activeSkillsData};
    }

    getDescription(skillDescriptionsLookup, value, effects, palNames) {
        return skillDescriptionsLookup[value['OverrideDescMsgID']]['TextData']['SourceString']
            .replace('{EffectValue1}', effects[0].value)
            .replace('{EffectValue2}', effects[1].value)
            .replace('{EffectValue3}', effects[2].value)
            .replace(/<characterName id=\|(.*)\|\/>/, (_, name) => palNames[name])
            .replace(/<Num(Blue|Red)_\d*>(.*)<\/>/, '$2');
    }

    buildDescription(skillDescriptionsLookup, value, effects) {
        return effects
            .filter(({type}) => type !== 'EPalPassiveSkillEffectType::no')
            .map(({type, value}) => `${type.split('::')[1]}: ${value > 0 ? '+' : ''}${value}%`)
            .join('\n');
    }
}

module.exports = {
    UsefulDataMapper
};
