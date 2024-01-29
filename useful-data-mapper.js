class UsefulDataMapper {
    #worldSaveData;

    constructor(worldSaveData) {
        this.#worldSaveData = worldSaveData;
    }

    characterSaveParameterMapper() {
        const toPlayerGroups = (acc, curr) => {
            const playerId = curr.key['PlayerUId'].value;
            if (!acc[playerId]) {
                acc[playerId] = [];
            }
            acc[playerId].push(curr.value['RawData'].value.object['SaveParameter'].value);
            return acc;
        };

        const playerGroups = this.#worldSaveData.value['CharacterSaveParameterMap'].value.reduce(toPlayerGroups, {});

        return Object.entries(playerGroups)
            .map(([key, records]) => {
                const indexOfPlayerData = records.findIndex((record) => record['IsPlayer'].value);
                const userData = records.splice(indexOfPlayerData, 1)[0];
                return {
                    userId: key,
                    userData: this.formatRecord(userData),
                    extraData: records.map(this.formatRecord.bind(this))
                };
            });
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
        const {userData, extraData} = players.find((player) => player.userId === id);

        const playerData = {
            id,
            level: userData['Level'],
            exp: userData['Exp'],
            name: userData['NickName']
        };

        const palData = extraData.map((pal) => {
            return {
                characterId: pal['CharacterID'], /* todo map */
                gender: pal['Gender'].split('::')[1],
                level: pal['Level'],
                exp: pal['Exp'],
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
                passiveSkillList: pal['PassiveSkillList'], /* todo map */
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
