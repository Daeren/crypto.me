const { pkcs5, cipher, md, random } = require('node-forge');

const { binStr2Buf } = require('./tools');
const { toForgeBuffer } = require('./helpers');

//--------------------------------------------------

module.exports = {
    genKeyInfo,

    encrypt,
    decrypt
};

//--------------------------------------------------

function genKeyInfo(password, userSalt) {
    // Note: a key size of 16 bytes will use AES-128, 24 => AES-192, 32 => AES-256
    const keySize = 32;
    // The number of bytes should be 12 (96 bits) as recommended by NIST SP-800-38D but another length may be given.
    const ivSize = 12;

    const saltSize = 32;
    const salt = (
        userSalt
            ? toForgeBuffer(userSalt, true)
            : toForgeBuffer(random.getBytesSync(saltSize))
    ).getBytes();

    const numIterations = 1000 * 10;
    const m = md.sha256.create();

    //---]>

    return new Promise((resolve) => {
        pkcs5.pbkdf2(toForgeBuffer(password, true), salt, numIterations, keySize + ivSize, m, function(error, derivedBytes) {
            if(error) {
                resolve(error);
                return;
            }

            const buffer = toForgeBuffer(derivedBytes);

            const key = binStr2Buf(buffer.getBytes(keySize));
            const iv = binStr2Buf(buffer.getBytes(ivSize));

            resolve({ salt: binStr2Buf(salt), key, iv });
        });
    });
}

//---]>

function encrypt(key, iv) {
    const c = cipher.createCipher('AES-GCM', toForgeBuffer(key));

    //-----]>

    try {
        c.start({
            iv: toForgeBuffer(iv)
        });
    }
    catch(e) {
        return e;
    }

    //-----]>

    return {
        update(data) {
            c.update(toForgeBuffer(data, true));
        },

        digest(asBuffer = true) {
            c.finish();

            const data = c.output.getBytes();

            const tag = binStr2Buf(c.mode.tag.getBytes());
            const body = asBuffer ? binStr2Buf(data) : data;

            return { tag, body };
        }
    };
}

function decrypt(key, iv, tag) {
    const c = cipher.createDecipher('AES-GCM', toForgeBuffer(key));

    //-----]>

    try {
        c.start({
            iv: toForgeBuffer(iv),
            tag // authentication tag from encryption
        });
    }
    catch(e) {
        return e;
    }

    //-----]>

    return {
        update(data) {
            c.update(toForgeBuffer(data, true));
        },

        digest(asBuffer = true) {
            const result = c.finish();

            if(result) {
                const body = c.output.getBytes();
                return asBuffer ? binStr2Buf(body) : body;
            }

            // Pass is `null` if there was a failure (eg: authentication tag didn't match)
            return null;
        }
    };
}
