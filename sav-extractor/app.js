const fs = require('fs');

const {decompressData} = require('./decompressor');
const {ArchiveReader} = require('./archive-reader');
const {UsefulDataMapper} = require('./useful-data-mapper');

const {decompressedData} = decompressData('./in/Level.sav');

const archiveReader = new ArchiveReader(decompressedData);

const header = archiveReader.readHeader();
const properties = archiveReader.readProperties();

const usefulDataMapper = new UsefulDataMapper(properties.worldSaveData);

const {players, pals} = usefulDataMapper.characterSaveParameterMapper();
const guilds = usefulDataMapper.groupSaveDataMapper();
const combinedData = usefulDataMapper.combineGuildsAndPlayers(players, guilds);
const {palNames, skillNames, palDescriptions, skillDescriptions, activeSkillsData} = usefulDataMapper.transformDumpedGameFiles();

const replacerFunction = (key, value) => typeof value === 'bigint' ? value.toString() : value;

fs.writeFileSync('./out/extracted-data/players.json', JSON.stringify(players, replacerFunction, 4));
fs.writeFileSync('./out/extracted-data/guilds.json', JSON.stringify(guilds, replacerFunction, 4));
fs.writeFileSync('./out/extracted-data/combined.json', JSON.stringify(combinedData, replacerFunction, 4));
fs.writeFileSync('./out/extracted-data/pals.json', JSON.stringify(pals, replacerFunction, 4));
fs.writeFileSync('./out/dumped-game-files/pal-names.json', JSON.stringify(palNames, null, 4));
fs.writeFileSync('./out/dumped-game-files/skill-names.json', JSON.stringify(skillNames, null, 4));
fs.writeFileSync('./out/dumped-game-files/pal-descriptions.json', JSON.stringify(palDescriptions, null, 4));
fs.writeFileSync('./out/dumped-game-files/skill-descriptions.json', JSON.stringify(skillDescriptions, null, 4));
fs.writeFileSync('./out/dumped-game-files/active-skills-data.json', JSON.stringify(activeSkillsData, null, 4));

Object.entries(properties.worldSaveData.value).forEach(([type, obj]) => {
    fs.writeFileSync('./out/world-save-data-sections/' + type + '.json', JSON.stringify(obj, replacerFunction, 2));
});
