# Asset
The Asset class represents tokens created with the eosio.token contract

## Properties
### amount: number
The amount of a given Asset (token)
### symbol: TokenSymbol
the symbol of the token.  Defines the code and precision of the token

## Constructor

### constructor(amount: number, symbol: TokenSymbol)

## Methods

### static fromString(assetString: string): Asset

Returns an asset instance from the assetString parameter (example **"10.0000 EOS"**).

### toString(): string

Converts an Asset object to a string representation (example **"10.0000 EOS"**).

### amountFixed(): string

Returns the string representation of the Asset amount (example **"10.0000"**).

### sub(quantity: Asset | number)

Returns the result of the Asset minus the Asset or number provided as input.

### add(quantity: Asset | number)

Returns the result of the Asset plus the Asset or number provided as input.

