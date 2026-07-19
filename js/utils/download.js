const DownloadUtils = {
    downloadJSON(data, filename) {
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        this._triggerDownload(blob, filename);
    },

    downloadJS(content, filename) {
        const blob = new Blob([content], { type: 'application/javascript' });
        this._triggerDownload(blob, filename);
    },

    downloadCSS(content, filename) {
        const blob = new Blob([content], { type: 'text/css' });
        this._triggerDownload(blob, filename);
    },

    downloadPNG(blob, filename) {
        this._triggerDownload(blob, filename);
    },

    downloadZip(files) {
        this._createZip(files).then(blob => {
            this._triggerDownload(blob, 'extension.zip');
        });
    },

    _createZip(files) {
        return new Promise((resolve) => {
            const zipEntries = [];
            let offset = 0;

            for (const [filename, content] of Object.entries(files)) {
                const encoder = new TextEncoder();
                const data = encoder.encode(content);

                const localHeader = this._createLocalFileHeader(filename, data);
                const centralDir = this._createCentralDirEntry(filename, data, offset);

                zipEntries.push({ localHeader, data, centralDir });
                offset += localHeader.length + data.length;
            }

            const centralDirData = new Uint8Array(
                zipEntries.reduce((sum, e) => sum + e.centralDir.length, 0)
            );
            let cdOffset = 0;
            for (const entry of zipEntries) {
                centralDirData.set(entry.centralDir, cdOffset);
                cdOffset += entry.centralDir.length;
            }

            const eocd = this._createEOCD(
                zipEntries.length,
                centralDirData.length,
                offset
            );

            const totalSize = offset + centralDirData.length + eocd.length;
            const zip = new Uint8Array(totalSize);
            let writeOffset = 0;

            for (const entry of zipEntries) {
                zip.set(entry.localHeader, writeOffset);
                writeOffset += entry.localHeader.length;
                zip.set(entry.data, writeOffset);
                writeOffset += entry.data.length;
            }

            zip.set(centralDirData, writeOffset);
            writeOffset += centralDirData.length;
            zip.set(eocd, writeOffset);

            resolve(new Blob([zip], { type: 'application/zip' }));
        });
    },

    _createLocalFileHeader(filename, data) {
        const encoder = new TextEncoder();
        const nameBytes = encoder.encode(filename);
        const header = new Uint8Array(30 + nameBytes.length);
        const view = new DataView(header.buffer);

        view.setUint32(0, 0x04034b50, true);
        view.setUint16(4, 20, true);
        view.setUint16(6, 0, true);
        view.setUint16(8, 0, true);
        view.setUint16(10, 0, true);

        const now = new Date();
        const dosTime = (now.getHours() << 11) | (now.getMinutes() << 5) | (now.getSeconds() >> 1);
        const dosDate = ((now.getFullYear() - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate();
        view.setUint16(12, dosTime, true);
        view.setUint16(14, dosDate, true);

        const crc = this._crc32(data);
        view.setUint32(16, crc, true);
        view.setUint32(20, data.length, true);
        view.setUint32(24, data.length, true);
        view.setUint16(28, nameBytes.length, true);
        view.setUint16(30 + nameBytes.length - 2, 0, true);

        header.set(nameBytes, 30);
        return header;
    },

    _createCentralDirEntry(filename, data, localOffset) {
        const encoder = new TextEncoder();
        const nameBytes = encoder.encode(filename);
        const entry = new Uint8Array(46 + nameBytes.length);
        const view = new DataView(entry.buffer);

        view.setUint32(0, 0x02014b50, true);
        view.setUint16(4, 20, true);
        view.setUint16(6, 20, true);
        view.setUint16(8, 0, true);
        view.setUint16(10, 0, true);
        view.setUint16(12, 0, true);

        const crc = this._crc32(data);
        view.setUint32(16, crc, true);
        view.setUint32(20, data.length, true);
        view.setUint32(24, data.length, true);
        view.setUint16(28, nameBytes.length, true);
        view.setUint16(30, 0, true);
        view.setUint16(32, 0, true);
        view.setUint16(34, 0, true);
        view.setUint32(36, 0, true);
        view.setUint32(40, 0, true);
        view.setUint32(42, localOffset, true);

        entry.set(nameBytes, 46);
        return entry;
    },

    _createEOCD(entryCount, cdSize, cdOffset) {
        const eocd = new Uint8Array(22);
        const view = new DataView(eocd.buffer);

        view.setUint32(0, 0x06054b50, true);
        view.setUint16(4, 0, true);
        view.setUint16(6, 0, true);
        view.setUint16(8, entryCount, true);
        view.setUint16(10, entryCount, true);
        view.setUint32(12, cdSize, true);
        view.setUint32(16, cdOffset, true);
        view.setUint16(20, 0, true);

        return eocd;
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

    _triggerDownload(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
};
