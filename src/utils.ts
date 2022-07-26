import { uint64ToName } from "eosjs-account-name";
/**
 * Sleeps for the given milliseconds duration
 *
 * @param {Number} milliseconds number of milliseconds to sleep
 * @return {Promise}
 * @api public
 */
export function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export function toAssetQuantity(quantity: number, symbol) {
  return `${quantity.toFixed(symbol.decimal)} ${symbol.symbol}`;
}

export function generateAccountName(): string {
  const randomUint = Math.floor(Math.random() * Number.MAX_VALUE);
  return uint64ToName(randomUint);
}

export function generateTapos() {
  return {
    blocksBehind: 3,
    // prevent duplicate transaction
    expireSeconds: 300 + Math.floor(Math.random() * 3300),
  };
}
