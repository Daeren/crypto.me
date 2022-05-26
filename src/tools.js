module.exports = {
    binStr2Buf
}

//--------------------------------------------------

/**
 *
 * @param {string} str - as a byte string
 * @returns {Uint8Array}
 */
function binStr2Buf(str) {
    const len = str ? str.length : 0;

    const buf = new ArrayBuffer(len);
    const bufView = new Uint8Array(buf);

    for(let i = 0; i < len; i++) {
        bufView[i] = str.charCodeAt(i);
    }

    return bufView;
}
