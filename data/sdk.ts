import { CryptoStatsSDK } from '@cryptostats/sdk';

const sdk = new CryptoStatsSDK({
  etherscanKey: process.env.ETHERSCAN_KEY,
  mongoConnectionString: process.env.MONGO_CONNECTION_STRING,
  redisConnectionString: process.env.REDIS_URL,
});

const cacheQueryByParam = (cacheQuery: string) =>
  (_id: string, query: string, params: string[]) => query === cacheQuery ? params[0] : null

sdk
  .getCollection('rollup-l1-fees')
  .setCacheKeyResolver(cacheQueryByParam('oneDayFeesPaidUSD'));

sdk
  .getCollection('historic-l2-fees')
  .setCacheKeyResolver(cacheQueryByParam('oneDayAverageFeeSwap'));

sdk.ethers.addProvider('arbitrum-one', 'https://arb1.arbitrum.io/rpc');
sdk.ethers.addProvider('optimism', 'https://mainnet.optimism.io');

export default sdk;
