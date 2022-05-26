const { util } = require('node-forge');

//--------------------------------------------------

module.exports = {
    toForgeBuffer
}

//--------------------------------------------------

function toForgeBuffer(data, encodeUtf8 = false) {
    if(encodeUtf8 && typeof data === 'string') {
        data = (new TextEncoder()).encode(data);
    }

    return new util.ByteBuffer(data);
}
