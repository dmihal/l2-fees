import { CryptoStatsSDK } from '@cryptostats/sdk';

const sdk = new CryptoStatsSDK({
  ipfsGateway: 'http://subgraph.ethburned.com:5001',
});

sdk.ethers.addProvider('arbitrum-one', 'https://arb1.arbitrum.io/rpc');

export default sdk;
