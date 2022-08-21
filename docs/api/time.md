# Time

The Time class allows the manipulation of blocktime.  These functions only add time to the current block time (never reduces). Note that it is not super accurate. You will definitely increase time by at least the number of seconds you indicate, but likely a few seconds more. So you should not be trying to do super precision tests with this function. Give your tests a few seconds leeway when checking behaviour that does NOT exceed some time span. It will work well for exceeding timeouts, or making large leaps in time, etc.

## Properties
### chain: Chain
Reference to the chain instance
### timeAdded: number
Record of time added to chain

## Constructor
**constructor(chain: Chain): Time**

## Methods
### async increase(time: number, fromBlockTime: string = ""): Promise&lt;number&gt;

Incrementally increase time of chain. 

### async increaseTo(time: number): Promise&lt;number&gt;

Increase time of chain to specific time point. T
