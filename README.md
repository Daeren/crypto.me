Nuxt.js:
```javascript
import { CryptoMe } from 'crypto.me/types';
import * as cryptoMe from 'crypto.me';

//---]>

const { aes, rsa } = cryptoMe as CryptoMe;
```


AES:
```javascript
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
