class BufferWrapper {
    #data;
    #offset;

    constructor(data, offset = 0) {
        this.#data = data;
        this.#offset = offset;
    }

    readInt8() {
        const value = this.#data.readInt8(this.#offset);
        this.#offset += 1;
        return value;
    }

    readBoolean() {
        return this.readInt8() > 0;
    }

    readInt16() {
        const value = this.#data.readInt16LE(this.#offset);
        this.#offset += 2;
        return value;
    }

    readInt32() {
        const value = this.#data.readInt32LE(this.#offset);
        this.#offset += 4;
        return value;
    }

    readUInt32() {
        const value = this.#data.readUint32LE(this.#offset);
        this.#offset += 4;
        return value;
    }

    readFloat() {
        const value = this.#data.readFloatLE(this.#offset);
        this.#offset += 4;
        return value;
    }

    readInt64() {
        const value = this.#data.readBigInt64LE(this.#offset);
        this.#offset += 8;
        return value;
    }

    readUInt64() {
        const value = this.#data.readBigUint64LE(this.#offset);
        this.#offset += 8;
        return value;
    }

    readDouble() {
        const value = this.#data.readDoubleLE(this.#offset);
        this.#offset += 8;
        return value;
    }

    readInt(amountOfBytes) {
        const value = this.#data.readIntLE(this.#offset, amountOfBytes);
        this.#offset += amountOfBytes;
        return value;
    }

    subArray(size) {
        const value = this.#data.subarray(this.#offset, this.#offset + size);
        this.#offset += size;
        return value;
    }
}

module.exports = {
    BufferWrapper
};