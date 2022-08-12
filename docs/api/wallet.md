# Wallet

A helper functions for wallet management.

## Functions

### importKey(privateKey: string)

Import a public key to the wallet.

### createKey(): KeyPair

Create new public/private key pair.

## Types

```
interface KeyPair {
  publicKey: PublicKey;
  privateKey: PrivateKey;
}
```
