import { Symbol } from './symbol';

export class Asset {
  public amount: number;
  public symbol: Symbol;

  constructor(amount: number, symbol: Symbol) {
    this.amount = amount;
    this.symbol = symbol;
  }

  static fromString(assetString: string): Asset {
    const assetStringSplit = assetString.split(' ');
    const quantity = Number(assetStringSplit[0]);
    if (isNaN(quantity)) {
      throw new Error('asset is not valid');
    }
    const quantitySplit = assetStringSplit[0].split('.');
    const decimal = quantitySplit[1].length;

    const symbol = new Symbol(decimal, assetStringSplit[1]);
    return new Asset(quantity, symbol);
  }

  toString(): string {
    return this.symbol.convertAssetString(this.amount);
  }

  amountFixed(): string {
    return this.symbol.convertQuantity(this.amount);
  }

  sub(quantity: Asset | number) {
    let subtractor = quantity;
    if (quantity instanceof Asset) {
      subtractor = quantity.amount;
    }
    // @ts-ignore
    this.amount = this.amount - subtractor;
    return this;
  }

  add(quantity: Asset | number) {
    let adder = quantity;
    if (quantity instanceof Asset) {
      adder = quantity.amount;
    }
    // @ts-ignore
    this.amount = this.amount + adder;
    return this;
  }
}