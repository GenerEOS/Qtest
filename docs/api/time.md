# Time

The Time class allows the manipulation of blocktime.

## Constructor
**constructor(chain: Chain): Time**

## Methods
### async increase(time: number, fromBlockTime: string = ""): Promise&lt;number&gt;

Increase time of chain. This function only adds time to the current block time (never reduces). Realize that it is not super accurate.You will definitely increase time by at least the number of seconds you indicate, but likely a few seconds more. So you should not be trying to do super precision tests with this function. Give your tests a few seconds leeway when checking behaviour that does NOT exceed some time span. It will work well for exceeding timeouts, or making large leaps in time, etc.


### async increaseTo(time: number): Promise&lt;number&gt;

Increase time of chain to specific time point. This function only modify chain time to the specific time point greater than current head block time. Realize that it is not super accurate.You will definitely increase time by at least the number of seconds you indicate, but likely a few seconds more. So you should not be trying to do super precision tests with this function. Give your tests a few seconds leeway when checking behaviour that does NOT exceed some time span. It will work well for exceeding timeouts, or making large leaps in time, etc.
