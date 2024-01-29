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
}

module.exports = {
    UsefulDataMapper
};
