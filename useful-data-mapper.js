const fs = require('fs');

class UsefulDataMapper {
    #worldSaveData;
    #palNames;
    #skillNames;

    constructor(worldSaveData) {
        this.#worldSaveData = worldSaveData;
        this.#palNames = Object.entries(JSON.parse(fs.readFileSync('./dumped-game-files/palnames.json', 'utf-8'))[0]['Rows'])
            .map(([key, value]) => ({key: key.replace('PAL_NAME_', ''), value: value['TextData']['LocalizedString']}))
            .reduce((acc, curr) => {
                acc[curr.key] = curr.value;
                return acc;
            }, {});
        this.#skillNames = Object.entries(JSON.parse(fs.readFileSync('./dumped-game-files/skillnametext.json', 'utf-8'))[0]['Rows'])
            .map(([key, value]) => ({key, value: value['TextData']['LocalizedString']}))
            .reduce((acc, curr) => {
                acc[curr.key] = curr.value;
                return acc;
            }, {});
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
                pals.push(saveParameter);
            }
        }

        for (let pal of pals) {
            const ownerId = pal['OwnerPlayerUId'].value;
            players[ownerId].pals.push(this.formatRecord(pal));
        }

        return players;
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
            return {
                characterId: pal['CharacterID'],
                characterName: this.#palNames[pal['CharacterID']],
                gender: pal['Gender']?.split('::')[1],
                level: pal['Level'],
                exp: pal['Exp'],
                moves: {
                    equiped: pal['EquipWaza'].map((move) => {
                        const id = move.split('::')[1];
                        return {id, name: this.#skillNames['ACTION_SKILL_' + id]};
                    }),
                    mastered: pal['MasteredWaza'].map((move) => {
                        const id = move.split('::')[1];
                        return {id, name: this.#skillNames['ACTION_SKILL_' + id]};
                    })
                },
                talent: {
                    hp: pal['Talent_HP'],
                    melee: pal['Talent_Melee'],
                    shot: pal['Talent_Shot'],
                    defense: pal['Talent_Defense']
                },
                passiveSkillList: pal['PassiveSkillList']?.map((id) => ({id, name: this.#skillNames['PASSIVE_' + id]})),
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
}

module.exports = {
    UsefulDataMapper
};
