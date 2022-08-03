# Symbol

The Symbol class represents an eosio tokens symbol code (ex. "EOS") and it's precision.  The symbol class will rarely need to be used directly.

## Constructor
### constructor(decimal: number, symbol: string): Symbol

## Methods
### static fromString(symbolString: string): Symbol

Creates a Symbol object from a string representation.

### toString(): string

Returns the string representation of a Symbol instance.

### convertAssetString(quantity: number): string

Returns a string representation for the given quantity.

### convertQuantity(quantity: number): string

Returns a string representation of just the quantity.

