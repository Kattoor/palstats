const {BufferWrapper} = require('./buffer-wrapper');

function bufferToGuid(buffer) {
    const bufferWrapper = new BufferWrapper(Buffer.from(buffer));
    const parts = [bufferWrapper.readUInt32(), bufferWrapper.readUInt32(), bufferWrapper.readUInt32(), bufferWrapper.readUInt32()];
    const guidString = parts.map((part) => part.toString(16).padStart(8, '0')).join('').toUpperCase();
    return `${guidString.substring(0, 8)}-${guidString.substring(8, 12)}-${guidString.substring(12, 16)}-${guidString.substring(16, 20)}-${guidString.substring(20)}`;
}

module.exports = {
    bufferToGuid
};
