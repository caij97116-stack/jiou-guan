const PNGUtils = {
    encodePNG(jsonData, imageDataUrl, spec) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);

                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const pngBlob = this._createPNGWithChunks(imageData, jsonData, spec);
                resolve(pngBlob);
            };
            img.onerror = reject;
            img.src = imageDataUrl || this._getDefaultImage();
        });
    },

    decodePNG(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const buffer = new Uint8Array(e.target.result);
                try {
                    const textChunks = this._extractTextChunks(buffer);
                    resolve(textChunks);
                } catch (err) {
                    reject(err);
                }
            };
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
        });
    },

    _getDefaultImage() {
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 600;
        const ctx = canvas.getContext('2d');

        const gradient = ctx.createLinearGradient(0, 0, 400, 600);
        gradient.addColorStop(0, '#1a1a2e');
        gradient.addColorStop(0.5, '#16213e');
        gradient.addColorStop(1, '#0f3460');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 400, 600);

        ctx.fillStyle = '#e94560';
        ctx.font = 'bold 36px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Character Card', 200, 280);

        ctx.fillStyle = '#a0a0b0';
        ctx.font = '16px sans-serif';
        ctx.fillText('SillyTavern V3', 200, 320);

        return canvas.toDataURL('image/png');
    },

    _createPNGWithChunks(imageData, jsonData, spec) {
        const width = imageData.width;
        const height = imageData.height;

        const signature = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]);

        const encoder = new TextEncoder();
        const rawData = this._encodeImageData(imageData);
        const zlibRawData = this._deflate(rawData);

        const ihdrChunk = this._createIHDR(width, height);
        const idatChunk = this._createChunk('IDAT', zlibRawData);

        const jsonStr = JSON.stringify(jsonData);
        const base64Json = btoa(unescape(encodeURIComponent(jsonStr)));

        const charaKeyword = encoder.encode('chara');
        const charaData = new Uint8Array(charaKeyword.length + 1 + base64Json.length);
        charaData.set(charaKeyword, 0);
        charaData[charaKeyword.length] = 0;
        charaData.set(encoder.encode(base64Json), charaKeyword.length + 1);

        const ccv3Keyword = encoder.encode('ccv3');
        const ccv3Data = new Uint8Array(ccv3Keyword.length + 1 + base64Json.length);
        ccv3Data.set(ccv3Keyword, 0);
        ccv3Data[ccv3Keyword.length] = 0;
        ccv3Data.set(encoder.encode(base64Json), ccv3Keyword.length + 1);

        const charaChunk = this._createChunk('tEXt', charaData);
        const ccv3Chunk = this._createChunk('tEXt', ccv3Data);
        const iendChunk = this._createChunk('IEND', new Uint8Array(0));

        const totalLength = signature.length + ihdrChunk.length + idatChunk.length
            + charaChunk.length + ccv3Chunk.length + iendChunk.length;

        const png = new Uint8Array(totalLength);
        let offset = 0;
        png.set(signature, offset); offset += signature.length;
        png.set(ihdrChunk, offset); offset += ihdrChunk.length;
        png.set(idatChunk, offset); offset += idatChunk.length;
        png.set(charaChunk, offset); offset += charaChunk.length;
        png.set(ccv3Chunk, offset); offset += ccv3Chunk.length;
        png.set(iendChunk, offset);

        return new Blob([png], { type: 'image/png' });
    },

    _createIHDR(width, height) {
        const data = new Uint8Array(13);
        const view = new DataView(data.buffer);
        view.setUint32(0, width);
        view.setUint32(4, height);
        data[8] = 8;
        data[9] = 6;
        data[10] = 0;
        data[11] = 0;
        data[12] = 0;
        return this._createChunk('IHDR', data);
    },

    _createChunk(type, data) {
        const typeBytes = new TextEncoder().encode(type);
        const length = data.length;
        const chunk = new Uint8Array(12 + length);
        const view = new DataView(chunk.buffer);

        view.setUint32(0, length);
        chunk.set(typeBytes, 4);
        chunk.set(data, 8);

        const crcData = new Uint8Array(4 + length);
        crcData.set(typeBytes, 0);
        crcData.set(data, 4);
        const crc = this._crc32(crcData);
        view.setUint32(8 + length, crc);

        return chunk;
    },

    _crc32(data) {
        let crc = 0xFFFFFFFF;
        for (let i = 0; i < data.length; i++) {
            crc ^= data[i];
            for (let j = 0; j < 8; j++) {
                if (crc & 1) {
                    crc = (crc >>> 1) ^ 0xEDB88320;
                } else {
                    crc = crc >>> 1;
                }
            }
        }
        return (crc ^ 0xFFFFFFFF) >>> 0;
    },

    _encodeImageData(imageData) {
        const width = imageData.width;
        const height = imageData.height;
        const rawData = imageData.data;

        const rows = [];
        for (let y = 0; y < height; y++) {
            rows.push(0);
            const rowStart = y * width * 4;
            for (let x = 0; x < width; x++) {
                const px = rowStart + x * 4;
                rows.push(rawData[px]);
                rows.push(rawData[px + 1]);
                rows.push(rawData[px + 2]);
            }
        }
        return new Uint8Array(rows);
    },

    _deflate(data) {
        const MAX_BLOCK_SIZE = 65535;
        const result = [];
        let resultIdx = 0;

        for (let blockStart = 0; blockStart < data.length; blockStart += MAX_BLOCK_SIZE) {
            const blockEnd = Math.min(blockStart + MAX_BLOCK_SIZE, data.length);
            const blockLength = blockEnd - blockStart;

            const isLast = blockEnd === data.length;
            result[resultIdx++] = isLast ? 1 : 0;
            result[resultIdx++] = blockLength & 0xFF;
            result[resultIdx++] = (blockLength >> 8) & 0xFF;
            result[resultIdx++] = (~blockLength) & 0xFF;
            result[resultIdx++] = ((~blockLength) >> 8) & 0xFF;

            for (let i = blockStart; i < blockEnd; i++) {
                result[resultIdx++] = data[i];
            }
        }

        const header = new Uint8Array([0x78, 0x01]);
        const adler32sum = this._adler32(data);
        const trailer = new Uint8Array([
            (adler32sum >> 24) & 0xFF,
            (adler32sum >> 16) & 0xFF,
            (adler32sum >> 8) & 0xFF,
            adler32sum & 0xFF
        ]);

        const final = new Uint8Array(header.length + result.length + trailer.length);
        final.set(header, 0);
        final.set(result, header.length);
        final.set(trailer, header.length + result.length);
        return final;
    },

    _adler32(data) {
        const MOD_ADLER = 65521;
        let a = 1, b = 0;
        for (let i = 0; i < data.length; i++) {
            a = (a + data[i]) % MOD_ADLER;
            b = (b + a) % MOD_ADLER;
        }
        return ((b << 16) | a) >>> 0;
    },

    _extractTextChunks(buffer) {
        const signature = [137, 80, 78, 71, 13, 10, 26, 10];
        for (let i = 0; i < 8; i++) {
            if (buffer[i] !== signature[i]) {
                throw new Error('Not a valid PNG file');
            }
        }

        const chunks = {};
        let offset = 8;

        while (offset < buffer.length) {
            const length = (buffer[offset] << 24) | (buffer[offset + 1] << 16)
                | (buffer[offset + 2] << 8) | buffer[offset + 3];
            const type = String.fromCharCode(
                buffer[offset + 4], buffer[offset + 5],
                buffer[offset + 6], buffer[offset + 7]
            );

            if (type === 'tEXt') {
                const chunkData = buffer.subarray(offset + 8, offset + 8 + length);
                const nullIdx = chunkData.indexOf(0);
                const keyword = String.fromCharCode(...chunkData.subarray(0, nullIdx));
                const text = String.fromCharCode(...chunkData.subarray(nullIdx + 1));
                chunks[keyword] = text;
            }

            offset += 12 + length;
        }

        return chunks;
    }
};
