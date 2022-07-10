export class Symbol {
  public decimal: number;
  public symbol: string;

  constructor(decimal: number, symbol: string) {
    this.decimal = decimal;
    this.symbol = symbol;
  }

  static fromString(symbolString: string) {
    const symbolStringSplit = symbolString.split(',');
    const decimal = Number(symbolStringSplit[0]);
    if (isNaN(decimal)) {
      throw new Error('symbol string is not valid');
    }
    return new Symbol(Number(symbolStringSplit[0]), symbolStringSplit[1]);
  }

  toString(): string {
    return `${this.decimal},${this.symbol}`;
  }

  convertAssetString(quantity: number): string {
    return `${quantity.toFixed(this.decimal)} ${this.symbol}`;
  }

  convertQuantity(quantity: number): string {
    return `${quantity.toFixed(this.decimal)}`;
  }
}