const fs = require('fs');
const zlib = require('zlib');
const {BufferWrapper} = require('./buffer-wrapper');

function decompressData(path) {
    const buffer = new BufferWrapper(fs.readFileSync(path));

    const decompressedSize = buffer.readInt32();
    const compressedSize = buffer.readInt32();
    const magicHeader = buffer.readInt(3);
    const saveType = buffer.readInt8();

    const decompressedData = zlib.inflateSync(zlib.inflateSync(buffer.subArray(compressedSize)));

    return {
        decompressedSize,
        compressedSize,
        magicHeader,
        saveType,
        decompressedData
    };
}

module.exports = {
    decompressData
};
