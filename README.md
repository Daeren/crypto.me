AES:
```javascript
const { aes } = require('crypto.me');

const { key, iv, salt } = await aes.genKeyInfo('password');

//---]>

const enc = aes.encrypt(key, iv);
enc.update('hello');
const encData = enc.digest();

//---]>

const dec = aes.decrypt(key, iv, encData.tag);
dec.update(encData.body);
const decData = dec.digest();

console.log((new TextDecoder()).decode(decData));
```

RSA:
```javascript
const { rsa } = require('crypto.me');

const keyPair = await rsa.genKeyPair();
const keyPairCopy = rsa.keyPairFromJson(rsa.keyPairToJson(keyPair));

const data = 'hello';

//---]>

const sign = rsa.sign(keyPair);
sign.update(data);
const signature = sign.digest();

const verify = rsa.verify(keyPairCopy, signature);
verify.update(data);
const valid = verify.digest();

//---]>

const encData = rsa.encrypt(keyPair, data);
const decData = rsa.decrypt(keyPairCopy, encData);

console.log((new TextDecoder()).decode(decData));
```
