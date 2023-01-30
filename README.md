# Chia JS

TypeScript client for communicating with [Chia](https://www.chia.net/) RPC interfaces. All API calls return promises.

### Full Node

```
import { FullNode } from 'chia-js';

const fullNode = new FullNode({
    protocol: 'http',
    hostname: 'localhost',
    port: 8555
});

const blockchain = await fullNode.getBlockchainState();
```

### Wallet

```
import { Wallet } from 'chia-js';

const wallet = new Wallet({
    protocol: 'http',
    hostname: 'localhost',
    port: 8555
});

const mnemonic = await wallet.generateMnemonic();
```

# API
## FullNode

## Wallet

## Connection Management

