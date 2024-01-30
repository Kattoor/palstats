const fs = require('fs');

class UsefulDataMapper {
    #worldSaveData;

    constructor(worldSaveData) {
        this.#worldSaveData = worldSaveData;
    }

    characterSaveParameterMapper() {
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

    groupSaveDataMapper() {
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

    combineGuildsAndPlayers(allPlayers, allGuilds) {
        return allGuilds.map((guild) => {
            const guildId = guild.key;
            const {guildName, adminPlayerUid, players} = guild.data['RawData'];
            return {
                guildId,
                guildName,
                guildAdminId: adminPlayerUid,
                guildMembers: players.map((player) => ({...this.getPlayerById(allPlayers, player.playerUid)}))
            };
        });
    }

    getPlayerById(players, id) {
        const {userData, pals} = players[id];

        const playerData = {
            id,
            level: userData['Level'],
            exp: userData['Exp'],
            name: userData['NickName']
        };

        const palData = pals.map((pal) => {
            const isBoss = pal['CharacterID'].startsWith('BOSS_') || pal['CharacterID'].startsWith('Boss_');
            const characterId = pal['CharacterID'].slice(isBoss ? 5 : 0);
            return {
                characterId: characterId === 'Sheepball' ? 'SheepBall' : characterId,
                isBoss,
                isHuman: pal['MasteredWaza'].length === 1 && pal['MasteredWaza'][0] === 'EPalWazaID::Human_Punch',
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
            .map(([key, value]) => ({key: key.replace('PAL_NAME_', ''), value: value['TextData']['LocalizedString']}))
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
                key: key.replace('PAL_LONG_DESC_', ''),
                value: value['TextData']['LocalizedString']
            }))
            .reduce((acc, curr) => {
                curr.value = curr.value.replace(/<characterName id=\|(.*)\|\/>/, (_, name) => palNames[name]);
                acc[curr.key] = curr.value;
                return acc;
            }, {});

        const passiveSkillData = Object.entries(JSON.parse(fs.readFileSync('./dumped-game-files/DT_PassiveSkill_Main.json', 'utf-8'))[0]['Rows'])
            .map(([key, value]) => ({
                key,
                rank: value['Rank'],
                effects: [
                    value['EffectValue1'],
                    value['EffectValue2'],
                    value['EffectValue3']
                ]
            }))
            .reduce((acc, curr) => {
                acc[curr.key] = {rank: curr.rank, effects: curr.effects};
                return acc;
            }, {});

        const skillDescriptions = Object.entries(JSON.parse(fs.readFileSync('./dumped-game-files/DT_SkillDescText.json', 'utf-8'))[0]['Rows'])
            .map(([key, value]) => ({
                key,
                value: value['TextData']['LocalizedString']
            }))
            .reduce((acc, curr) => {
                if (curr.key.startsWith('PASSIVE_')) {
                    const skillData = passiveSkillData[curr.key.replace('PASSIVE_PAL_', '').replace('PASSIVE_', '').replace('_DESC', '')];

                    curr.value = curr.value
                        .replace('{EffectValue1}', skillData?.effects[0])
                        .replace('{EffectValue2}', skillData?.effects[1])
                        .replace('{EffectValue3}', skillData?.effects[2]);
                }

                curr.value = curr.value.replace(/<characterName id=\|(.*)\|\/>/, (_, name) => palNames[name]);
                curr.value = curr.value.replace(/<Num(Blue|Red)_\d*>(.*)<\/>/, '$2');

                acc[curr.key] = curr.value;
                return acc;
            }, {});

        return {palNames, skillNames, palDescriptions, skillDescriptions, activeSkillsData};
    }
}

module.exports = {
    UsefulDataMapper
};
