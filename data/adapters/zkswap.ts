import { Context } from '@cryptostats/sdk';

export function setup(sdk: Context) {
  // ZKSwap charges zero fee for 50 transfer per day
  const getZeroFee = () => {
    return 0
  };

  sdk.register({
    id: 'zkswap-v2',
    queries: {
      feeTransferEth: getZeroFee,
      feeTransferERC20: getZeroFee,
      // feeSwap: getFeeResolverForCost(2602626),
    },
    metadata: {
      icon: sdk.ipfs.getDataURILoader(
        'QmeUoQciQucqAE3X7Q3QyiY9GzyZ5zieuFEa2Kr6GuctUg',
        'image/svg+xml'
      ),
      category: 'l2',
      name: 'ZKSwap',
      description: 'ZKSync is a ZK Rollup that supports transfers of any token',
      l2BeatSlug: 'zkswapv2',
      website: 'https://zks.org',
    },
  });
}
