const fs = require('fs');

const {decompressData} = require('./decompressor');
const {ArchiveReader} = require('./archive-reader');
const {UsefulDataMapper} = require('./useful-data-mapper');

const {decompressedData} = decompressData('./in/Level.sav');

const archiveReader = new ArchiveReader(decompressedData);

const header = archiveReader.readHeader();
const properties = archiveReader.readProperties();

const usefulDataMapper = new UsefulDataMapper(properties.worldSaveData);
const players = usefulDataMapper.characterSaveParameterMapper();
const guilds = usefulDataMapper.groupSaveDataMapper();

const replacerFunction = (key, value) => typeof value === 'bigint' ? value.toString() : value;

fs.writeFileSync('./out/players.json', JSON.stringify(players, replacerFunction, 4));
fs.writeFileSync('./out/guilds.json', JSON.stringify(guilds, replacerFunction, 4));
