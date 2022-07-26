import {
  JsSignatureProvider,
  PrivateKey,
  PublicKey,
} from "eosjs/dist/eosjs-jssig";
import { generateKeyPair } from "eosjs/dist/eosjs-key-conversions";
import { Chain } from "./chain";

export const TESTING_PUBLIC_KEY =
  "EOS5dUsCQCAyHVjnqr6BFqVEE7w8XksnkRtz22wd9eFrSq4NHoKEH";
export const TESTING_KEY =
  "5JKxAqBoQuAYSh6YMcjxcougPpt1pi9L4PyJHwEQuZgYYgkWpjS";

export const initializedChain: Chain[] = [];

export const signatureProvider = new JsSignatureProvider([TESTING_KEY]);

export interface KeyPair {
  publicKey: PublicKey;
  privateKey: PrivateKey;
}

/**
 * Import key to signature provider
 *
 * @param {string} privateKey private key to import
 * @return {Promise<void>}
 * @api public
 */
export function importKey(privateKey: string) {
  const priv = PrivateKey.fromString(privateKey);
  const privElliptic = priv.toElliptic();
  const pubStr = priv.getPublicKey().toString();
  signatureProvider.keys.set(pubStr, privElliptic);
  signatureProvider.availableKeys.push(pubStr);
}

/**
 * Create new key
 *
 * @param {string} privateKey private key to import
 * @return {KeyPair} generated private key and public key
 * @api public
 */
export function createKey(): KeyPair {
  const newKeyPair = generateKeyPair(0, { secureEnv: true });
  importKey(newKeyPair.privateKey.toString());
  return newKeyPair;
}
