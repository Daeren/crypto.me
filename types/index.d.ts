export type CMByteString = string;

//--------------------------------------------------
// AES

export type CMAesKeyInfo = { salt: Uint8Array, key: Uint8Array, iv: Uint8Array };

export type CMAesEncryptData = { tag: Uint8Array, body: Uint8Array | CMByteString };
export type CMAesDecryptData = null | Uint8Array | CMByteString;

//---]>

export interface CMAesEncrypt {
    update(data: BufferSource | string): void;
    digest(asBuffer?: boolean): CMAesEncryptData
}

export interface CMAesDecrypt {
    update(data: BufferSource | string): void;
    digest(asBuffer?: boolean): CMAesDecryptData;
}

export interface CMAes {
    genKeyInfo(password: BufferSource | string, userSalt?: BufferSource | string): Promise<Error | CMAesKeyInfo>;

    encrypt(key: BufferSource, iv: BufferSource): CMAesEncrypt;
    decrypt(key: BufferSource, iv: BufferSource, tag: BufferSource): CMAesDecrypt;
}

//--------------------------------------------------
// RSA

export type CMRsaKeyPair = { privateKey: object, publicKey: object };
export type CMRsaKeyPairJson = { privateKey: string, publicKey: string };

//---]>

export interface CMRsaSign {
    update(data: BufferSource | string): void;
    digest(asBuffer?: boolean): Uint8Array | CMByteString;
}

export interface CMRsaVerify {
    update(data: BufferSource | string): void;
    digest(): boolean;
}

export interface CMRsa {
    genKeyPair(options?: object): Promise<CMRsaKeyPair>;

    keyPairToJson(kp: CMRsaKeyPair): CMRsaKeyPairJson;
    keyPairFromJson(data: string): CMRsaKeyPair;

    sign(kp: CMRsaKeyPair, saltLength?: number): CMRsaSign;
    verify(kp: CMRsaKeyPair, signature, saltLength?: number): CMRsaVerify;

    encrypt(kp: CMRsaKeyPair, data: BufferSource | string, asBuffer?: boolean): Error | Uint8Array | CMByteString;
    decrypt(kp: CMRsaKeyPair, data: BufferSource, asBuffer?: boolean): Error | Uint8Array | CMByteString;
}

//--------------------------------------------------

export interface CryptoMe {
    aes: CMAes,
    rsa: CMRsa
}
