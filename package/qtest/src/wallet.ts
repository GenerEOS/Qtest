import { JsSignatureProvider, PrivateKey } from 'eosjs/dist/eosjs-jssig';
import { generateKeyPair } from 'eosjs/dist/eosjs-key-conversions';
import { Chain } from './chain';

export const TESTING_PUBLIC_KEY = 'EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV';
export const TESTING_KEY = '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3';

export const initializedChain: Chain[] = [];

export const signatureProvider = new JsSignatureProvider([TESTING_KEY]);

export function importKey(privateKey: string) {
  const priv = PrivateKey.fromString(privateKey);
  const privElliptic = priv.toElliptic();
  const pubStr = priv.getPublicKey().toString();
  signatureProvider.keys.set(pubStr, privElliptic);
  signatureProvider.availableKeys.push(pubStr);
}

export function createKey() {
  const newKeyPair = generateKeyPair(0, { secureEnv: true });
  importKey(newKeyPair.privateKey.toString());
  return newKeyPair;
}