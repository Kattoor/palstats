const {BufferWrapper} = require('./buffer-wrapper');
const {bufferToGuid} = require('./guid-util');

const typeHints = {
    '.worldSaveData.CharacterContainerSaveData.Key': 'StructProperty',
    '.worldSaveData.CharacterSaveParameterMap.Key': 'StructProperty',
    '.worldSaveData.CharacterSaveParameterMap.Value': 'StructProperty',
    '.worldSaveData.FoliageGridSaveDataMap.Key': 'StructProperty',
    '.worldSaveData.FoliageGridSaveDataMap.Value.ModelMap.Value': 'StructProperty',
    '.worldSaveData.FoliageGridSaveDataMap.Value.ModelMap.Value.InstanceDataMap.Key': 'StructProperty',
    '.worldSaveData.FoliageGridSaveDataMap.Value.ModelMap.Value.InstanceDataMap.Value': 'StructProperty',
    '.worldSaveData.FoliageGridSaveDataMap.Value': 'StructProperty',
    '.worldSaveData.ItemContainerSaveData.Key': 'StructProperty',
    '.worldSaveData.MapObjectSaveData.MapObjectSaveData.ConcreteModel.ModuleMap.Value': 'StructProperty',
    '.worldSaveData.MapObjectSaveData.MapObjectSaveData.Model.EffectMap.Value': 'StructProperty',
    '.worldSaveData.MapObjectSpawnerInStageSaveData.Key': 'StructProperty',
    '.worldSaveData.MapObjectSpawnerInStageSaveData.Value': 'StructProperty',
    '.worldSaveData.MapObjectSpawnerInStageSaveData.Value.SpawnerDataMapByLevelObjectInstanceId.Key': 'Guid',
    '.worldSaveData.MapObjectSpawnerInStageSaveData.Value.SpawnerDataMapByLevelObjectInstanceId.Value': 'StructProperty',
    '.worldSaveData.MapObjectSpawnerInStageSaveData.Value.SpawnerDataMapByLevelObjectInstanceId.Value.ItemMap.Value': 'StructProperty',
    '.worldSaveData.WorkSaveData.WorkSaveData.WorkAssignMap.Value': 'StructProperty',
    '.worldSaveData.BaseCampSaveData.Key': 'Guid',
    '.worldSaveData.BaseCampSaveData.Value': 'StructProperty',
    '.worldSaveData.BaseCampSaveData.Value.ModuleMap.Value': 'StructProperty',
    '.worldSaveData.ItemContainerSaveData.Value': 'StructProperty',
    '.worldSaveData.CharacterContainerSaveData.Value': 'StructProperty',
    '.worldSaveData.GroupSaveDataMap.Key': 'Guid',
    '.worldSaveData.GroupSaveDataMap.Value': 'StructProperty',
    '.worldSaveData.EnemyCampSaveData.EnemyCampStatusMap.Value': 'StructProperty',
    '.worldSaveData.DungeonSaveData.DungeonSaveData.MapObjectSaveData.MapObjectSaveData.Model.EffectMap.Value': 'StructProperty',
    '.worldSaveData.DungeonSaveData.DungeonSaveData.MapObjectSaveData.MapObjectSaveData.ConcreteModel.ModuleMap.Value': 'StructProperty'
};

class ArchiveReader {
    #bufferWrapper;
    #customProperties = {
        ".worldSaveData.GroupSaveDataMap": this.decodeGroupData.bind(this),
        ".worldSaveData.CharacterSaveParameterMap.Value.RawData": this.decodeCharacterData.bind(this)
    };

    constructor(data = new Buffer()) {
        this.#bufferWrapper = new BufferWrapper(data);
    }

    readProperties(path = '') {
        const properties = {};
        let name = undefined;

        while (name !== 'None') {
            name = this.readString();

            if (name !== 'None') {
                const typeName = this.readString();
                const size = this.#bufferWrapper.readUInt64();
                properties[name] = this.readProperty(typeName, size, `${path}.${name}`);
            }
        }

        return properties;
    }

    readProperty(typeName, size, path, allowCustom = true) {
        let value = {};
        if (allowCustom && Object.keys(this.#customProperties).includes(path)) {
            value = this.#customProperties[path](typeName, size, path);
            value['custom_type'] = path;
        } else if (typeName === 'StructProperty') {
            value = this.readStruct(path);
        } else if (typeName === 'IntProperty') {
            value = {
                id: this.readOptionalGuid(),
                value: this.#bufferWrapper.readInt32()
            };
        } else if (typeName === 'Int64Property') {
            value = {
                id: this.readOptionalGuid(),
                value: this.#bufferWrapper.readInt64()
            };
        } else if (typeName === 'FixedPoint64Property') {
            value = {
                id: this.readOptionalGuid(),
                value: this.#bufferWrapper.readInt32()
            };
        } else if (typeName === 'FloatProperty') {
            value = {
                id: this.readOptionalGuid(),
                value: this.#bufferWrapper.readFloat()
            };
        } else if (typeName === 'StrProperty') {
            value = {
                id: this.readOptionalGuid(),
                value: this.readString()
            };
        } else if (typeName === 'NameProperty') {
            value = {
                id: this.readOptionalGuid(),
                value: this.readString()
            };
        } else if (typeName === 'EnumProperty') {
            const enumType = this.readString();
            const id = this.readOptionalGuid();
            const enumValue = this.readString();
            value = {
                id,
                value: {
                    type: enumType,
                    value: enumValue
                }
            };
        } else if (typeName === 'BoolProperty') {
            const boolValue = this.#bufferWrapper.readBoolean();

            value = {
                value: boolValue,
                id: this.readOptionalGuid()
            };
        } else if (typeName === 'ArrayProperty') {
            const arrayType = this.readString();
            value = {
                arrayType,
                id: this.readOptionalGuid(),
                value: this.readArrayProperty(arrayType, size - BigInt(4), path)
            };
        } else if (typeName === 'MapProperty') {
            const keyType = this.readString();
            const valueType = this.readString();
            const id = this.readOptionalGuid();
            const idk = this.#bufferWrapper.readInt32();
            const count = this.#bufferWrapper.readInt32();

            const keyPath = path + '.Key';
            let keyStructType = null;
            if (keyType === 'StructProperty') {
                keyStructType = this.readGetTypeOr(keyPath, 'Guid');
            }

            const valuePath = path + '.Value';
            let valueStructType = null;
            if (valueType === 'StructProperty') {
                valueStructType = this.readGetTypeOr(valuePath, 'StructProperty');
            }

            const values = [];
            for (let i = 0; i < count; i++) {
                const key = this.readPropValue(keyType, keyStructType, keyPath);
                const value = this.readPropValue(valueType, valueStructType, valuePath);
                values.push({key, value});
            }
            value = {
                keyType,
                valueType,
                keyStructType,
                valueStructType,
                id,
                value: values
            };
        }

        value.type = typeName;
        return value;
    }

    readPropValue(typeName, structTypeName, path) {
        if (typeName === 'StructProperty') {
            return this.readStructValue(structTypeName, path);
        } else if (typeName === 'EnumProperty') {
            return this.readString();
        } else if (typeName === 'NameProperty') {
            return this.readString();
        } else if (typeName === 'IntProperty') {
            return this.#bufferWrapper.readInt32();
        } else if (typeName === 'BoolProperty') {
            return this.#bufferWrapper.readBoolean();
        }
    }

    readGetTypeOr(path, defaultValue) {
        if (Object.keys(typeHints).includes(path)) {
            return typeHints[path];
        } else {
            return defaultValue;
        }
    }

    readStruct(path) {
        const structType = this.readString();
        const structId = this.readUuid();
        const id = this.readOptionalGuid();
        const value = this.readStructValue(structType, path);
        return {
            structType,
            structId,
            id,
            value
        };
    }

    readStructValue(structType, path) {
        if (structType === 'Vector') {
            return {
                x: this.#bufferWrapper.readDouble(),
                y: this.#bufferWrapper.readDouble(),
                z: this.#bufferWrapper.readDouble()
            };
        } else if (structType === 'DateTime') {
            return this.#bufferWrapper.readUInt64()
        } else if (structType === 'Guid') {
            return this.readUuid();
        } else if (structType === 'Quat') {
            return {
                x: this.#bufferWrapper.readDouble(),
                y: this.#bufferWrapper.readDouble(),
                z: this.#bufferWrapper.readDouble(),
                w: this.#bufferWrapper.readDouble()
            };
        } else if (structType === 'LinearColor') {
            return {
                r: this.#bufferWrapper.readFloat(),
                g: this.#bufferWrapper.readFloat(),
                b: this.#bufferWrapper.readFloat(),
                a: this.#bufferWrapper.readFloat()
            };
        } else {
            return this.readProperties(path);
        }
    }

    readUuid() {
        return bufferToGuid(this.#bufferWrapper.subArray(16));
    }

    readOptionalGuid() {
        if (this.#bufferWrapper.readBoolean()) {
            return this.readUuid();
        }
    }

    readArrayProperty(arrayType, size, path) {
        const count = this.#bufferWrapper.readUInt32();
        let value = {};
        if (arrayType === 'StructProperty') {
            const propName = this.readString();
            const propType = this.readString();
            const idk = this.#bufferWrapper.readUInt64()
            const typeName = this.readString();
            const id = this.readUuid();
            const idk2 = this.#bufferWrapper.readInt8();
            const propValues = [];
            for (let i = 0; i < count; i++) {
                propValues.push(this.readStructValue(typeName, `${path}.${propName}`));
                value = {
                    propName,
                    propType,
                    values: propValues,
                    typeName,
                    id
                };
            }
        } else {
            value = {
                values: this.readArrayValue(arrayType, count, size)
            };
        }
        return value;
    }

    readArrayValue(arrayType, count, size) {
        const values = [];
        for (let i = 0; i < count; i++) {
            if (arrayType === 'EnumProperty') {
                values.push(this.readString());
            } else if (arrayType === 'NameProperty') {
                values.push(this.readString());
            } else if (arrayType === 'Guid') {
                values.push(this.readUuid());
            } else if (arrayType === 'ByteProperty') {
                if (size === BigInt(count)) {
                    values.push(this.#bufferWrapper.readInt8());
                }
            }
        }
        return values;
    }

    readString() {
        let size = this.#bufferWrapper.readInt32();

        let loadUCS2Char = size < 0;

        if (loadUCS2Char) {
            size = -size;
        }

        if (size === 0) {
            return '';
        }

        if (loadUCS2Char) {
            return this.#bufferWrapper.subArray(size * 2).slice(0, -2).toString('utf16le');
        } else {
            return this.#bufferWrapper.subArray(size).slice(0, -1).toString();
        }
    }

    decodeCharacterData(typeName, size, path) {
        if (typeName === 'ArrayProperty') {
            const value = this.readProperty(typeName, size, path, false);
            const charBytes = value.value.values;
            value.value = new ArchiveReader(Buffer.from(charBytes)).decodeCharacterDataBytes();
            return value;
        }
    }

    decodeCharacterDataBytes() {
        const charData = {};
        charData.object = this.readProperties();
        charData.unknownBytes = this.#bufferWrapper.readInt(4);
        charData.groupId = this.readUuid();
        return charData;
    }

    decodeGroupData(typeName, size, path) {
        if (typeName === 'MapProperty') {
            const value = this.readProperty(typeName, size, path, false);
            const groupMap = value.value;
            for (let group of groupMap) {
                const groupType = group.value['GroupType'].value.value;
                const groupBytes = group.value['RawData'].value.values;
                group.value['RawData'].value = new ArchiveReader(Buffer.from(groupBytes)).decodeGroupDataBytes(groupType);
            }
            return value;
        }
    }

    decodeGroupDataBytes(groupType) {
        let groupData = {
            groupType,
            groupId: this.readUuid(),
            groupName: this.readString(),
            individualCharacterHandleIds: this.readTypeArray(this.instanceIdReader.bind(this))
        };
        if (['EPalGroupType::Guild', 'EPalGroupType::IndependentGuild', 'EPalGroupType::Organization'].includes(groupType)) {
            const orgType = this.#bufferWrapper.readInt8();
            const org = {
                orgType,
                baseIds: this.readTypeArray(this.readUuid)
            };
            groupData = {...groupData, ...org};
        }
        if (['EPalGroupType::Guild', 'EPalGroupType::IndependentGuild'].includes(groupType)) {
            const baseCampLevel = this.#bufferWrapper.readInt32()
            const guild = {
                baseCampLevel,
                mapObjectInstanceIdsBaseCampPoints: this.readTypeArray(this.readUuid),
                guildName: this.readString()
            };
            groupData = {...groupData, ...guild};
        }
        if (groupType === 'EPalGroupType::IndependentGuild') {
            const playerUid = this.readUuid();
            const guildName2 = this.readString();
            const lastOnlineRealTime = this.#bufferWrapper.readInt64()
            const playerName = this.readString();
            const indie = {
                playerUid,
                guildName2,
                playerInfo: {
                    lastOnlineRealTime,
                    playerName
                }
            };
            groupData = {...groupData, ...indie};
        }
        if (groupType === 'EPalGroupType::Guild') {
            const guild = {
                adminPlayerUid: this.readUuid(),
                players: []
            };
            const playerCount = this.#bufferWrapper.readInt32();
            for (let i = 0; i < playerCount; i++) {
                const playerUid = this.readUuid();
                const lastOnlineRealTime = this.#bufferWrapper.readInt64();
                const playerName = this.readString();
                const player = {
                    playerUid,
                    playerInfo: {
                        lastOnlineRealTime,
                        playerName
                    }
                };
                guild.players.push(player);
            }
            groupData = {...groupData, ...guild};
        }
        return groupData;
    }

    instanceIdReader() {
        return {
            guid: this.readUuid(),
            instanceId: this.readUuid()
        };
    }

    readTypeArray(typeReader) {
        const count = this.#bufferWrapper.readUInt32();
        const array = [];
        for (let i = 0; i < count; i++) {
            array.push(typeReader());
        }
        return array;
    }

    readHeader() {
        const header = this.#bufferWrapper.readInt32();
        const saveGameVersion = this.#bufferWrapper.readInt32();
        const packageFileVersionUe4 = this.#bufferWrapper.readInt32();
        const packageFileVersionUe5 = this.#bufferWrapper.readInt32();
        const engineVersionMajor = this.#bufferWrapper.readInt16();
        const engineVersionMinor = this.#bufferWrapper.readInt16();
        const engineVersionPatch = this.#bufferWrapper.readInt16();
        const engineVersionChangelist = this.#bufferWrapper.readInt32();
        const engineVersionBranch = this.readString();
        const customVersionFormat = this.#bufferWrapper.readInt32();

        const customVersions = this.readTypeArray(() => {
            const customVersionGuid = this.readUuid();
            const customVersion = this.#bufferWrapper.readInt32();
            return {customVersionGuid, customVersion};
        });

        const saveGameClassName = this.readString();

        return {
            header,
            saveGameVersion,
            packageFileVersionUe4,
            packageFileVersionUe5,
            engineVersionMajor,
            engineVersionMinor,
            engineVersionPatch,
            engineVersionChangelist,
            engineVersionBranch,
            customVersionFormat,
            customVersions,
            saveGameClassName
        };
    }
}

module.exports = {
    ArchiveReader
};
