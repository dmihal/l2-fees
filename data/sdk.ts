import { CryptoStatsSDK } from '@cryptostats/sdk';

const sdk = new CryptoStatsSDK({
  ipfsGateway: 'https://ipfs.cryptostats.community',
});

sdk.ethers.addProvider('arbitrum-one', 'https://arb1.arbitrum.io/rpc');
sdk.ethers.addProvider('optimism', 'https://mainnet.optimism.io');
sdk.ethers.addProvider('boba', 'https://mainnet.boba.network');

export default sdk;
