const { pki, pss, md, mgf } = require('node-forge');

const { binStr2Buf } = require('./tools');
const { toForgeBuffer } = require('./helpers');

//--------------------------------------------------

module.exports = {
    genKeyPair,

    keyPairToJson,
    keyPairFromJson,

    sign,
    verify,

    encrypt,
    decrypt
};

//--------------------------------------------------

function genKeyPair(options = {}) {
    // generate an RSA key pair asynchronously (uses web workers if available)
    // use workers: -1 to run a fast core estimator to optimize # of workers

    // *RECOMMENDED*: Can be significantly faster than sync. Will use native
    // Node.js 10.12.0+ or WebCrypto API if possible.

    const { rsa } = pki;

    //---]>

    options = {
        bits: 2048,
        workers: -1,

        ...options
    };

    //---]>

    return new Promise((resolve) => {
        rsa.generateKeyPair(options, (error, keypair) => {
            resolve(error || keypair);
        });
    });
}

//---]>

function keyPairToJson(kp) {
    return JSON.stringify({
        privateKey: pki.privateKeyToPem(kp.privateKey),
        publicKey: pki.publicKeyToPem(kp.publicKey)
    });
}

function keyPairFromJson(data) {
    const kp = JSON.parse(data);

    return {
        privateKey: pki.privateKeyFromPem(kp.privateKey),
        publicKey: pki.publicKeyFromPem(kp.publicKey)
    };
}

//---]>

function sign(kp, saltLength = 20) {
    const { privateKey } = kp;

    //---]>

    const m = md.sha1.create();
    const p = pss.create({
        md: md.sha1.create(),
        mgf: mgf.mgf1.create(md.sha1.create()),

        saltLength
    });

    //---]>

    return {
        update(data) {
            m.update(toForgeBuffer(data, true));
        },

        digest(asBuffer = true) {
            const result = privateKey.sign(m, p);
            return asBuffer ? binStr2Buf(result) : result;
        }
    };
}

function verify(kp, signature, saltLength = 20) {
    const { publicKey } = kp;

    //---]>

    const m = md.sha1.create();
    const p = pss.create({
        md: md.sha1.create(),
        mgf: mgf.mgf1.create(md.sha1.create()),

        saltLength
    });

    //---]>

    return {
        update(data) {
            m.update(toForgeBuffer(data, true));
        },

        digest() {
            return publicKey.verify(m.digest().getBytes(), toForgeBuffer(signature).getBytes(), p);
        }
    };
}

//---]>

function encrypt(kp, data, asBuffer = true) {
    const { publicKey } = kp;

    //---]>

    try {
        const body = publicKey.encrypt(toForgeBuffer(data, true).getBytes(), 'RSA-OAEP');
        return asBuffer ? binStr2Buf(body) : body;
    }
    catch(e) {
        return e;
    }
}

function decrypt(kp, data, asBuffer = true) {
    const { privateKey } = kp;

    //---]>

    try {
        const body = privateKey.decrypt(data, 'RSA-OAEP');
        return asBuffer ? binStr2Buf(body) : body;
    }
    catch(e) {
        return e;
    }
}

