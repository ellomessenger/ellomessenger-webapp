import bigInt from 'big-integer';
import {
  generateRandomBytes,
  modExp,
  readBigIntFromBuffer,
  readBufferFromBigInt,
  sha1,
} from '../Helpers';

export const SERVER_KEYS = [
  {
    fingerprint: bigInt(process.env.SERVER_KEY_F || ''),
    n: bigInt(process.env.SERVER_KEY_N || ''),
    e: Number(process.env.SERVER_KEY_E || 0),
  },
].reduce((acc, { fingerprint, ...keyInfo }) => {
  acc.set(fingerprint.toString(), keyInfo);
  return acc;
}, new Map<string, { n: bigInt.BigInteger; e: number }>());

/**
 * Encrypts the given data known the fingerprint to be used
 * in the way Telegram requires us to do so (sha1(data) + data + padding)

 * @param fingerprint the fingerprint of the RSA key.
 * @param data the data to be encrypted.
 * @returns {Buffer|*|undefined} the cipher text, or undefined if no key matching this fingerprint is found.
 */
export async function encrypt(fingerprint: bigInt.BigInteger, data: Buffer) {
  const key = SERVER_KEYS.get(fingerprint.toString());
  if (!key) {
    return undefined;
  }

  // len(sha1.digest) is always 20, so we're left with 255 - 20 - x padding
  const rand = generateRandomBytes(235 - data.length);

  const toEncrypt = Buffer.concat([await sha1(data), data, rand]);

  // rsa module rsa.encrypt adds 11 bits for padding which we don't want
  // rsa module uses rsa.transform.bytes2int(to_encrypt), easier way:
  const payload = readBigIntFromBuffer(toEncrypt, false);
  const encrypted = modExp(payload, bigInt(key.e), key.n);
  // rsa module uses transform.int2bytes(encrypted, keylength), easier:
  return readBufferFromBigInt(encrypted, 256, false);
}
