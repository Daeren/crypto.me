const { rsa, aes } = require('./../index');

//--------------------------------------------------

(async function() {
    console.log('---------------------------');
    console.log('AES:');

    await (async function() {
        const keyInfo = await aes.genKeyInfo('test');

        // console.log(keyInfo);

        //---]>

        const { key, iv } = keyInfo;

        const enc = aes.encrypt(key, iv);
        enc.update('hello привет ё');
        const encData = enc.digest();

        // console.log(encData);

        const dec = aes.decrypt(key, iv, encData.tag);
        dec.update(encData.body);
        const decData = dec.digest();

        console.log((new TextDecoder()).decode(decData));
    })();

    console.log('---------------------------');
    console.log('RSA:');

    await (async function() {
        const data = 'hello привет ё';

        //---]>

        const keyPair = await rsa.genKeyPair();
        const keyPairCopy = rsa.keyPairFromJson(rsa.keyPairToJson(keyPair));

        //---]>

        const sign = rsa.sign(keyPair);
        sign.update(data);
        const signature = sign.digest();

        // console.log(signature.length);

        const verify = rsa.verify(keyPairCopy, signature);
        verify.update(data);
        const valid = verify.digest();

        console.log('valid:', valid);

        //---]>

        const encData = rsa.encrypt(keyPair, data);
        // console.log(encData.length);

        const decData = rsa.decrypt(keyPairCopy, encData);
        console.log((new TextDecoder()).decode(decData));
    })();
})();
