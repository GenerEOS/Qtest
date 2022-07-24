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

export function generateTapos() {
  return {
    blocksBehind: 3,
    // prevent duplicate transaction
    expireSeconds: 300 + Math.floor(Math.random() * 3300),
  };
}

export function blockTimeToMs(blockTime: string): number {
  const blockTimeDate = new Date(blockTime);
  return blockTimeDate.getTime();
}
