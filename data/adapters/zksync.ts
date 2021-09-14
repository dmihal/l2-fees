import { Context } from '@cryptostats/sdk';
import { getRollupSpenders } from './rollup-spenders';

export function setup(sdk: Context) {
  const getFeeForTransfer = async () => {
    const feeData = await sdk.http.post('https://api.zksync.io/jsrpc', {
      jsonrpc: '2.0',
      id: 1,
      method: 'get_tx_fee',
      params: ['Transfer', '0x4353b45f148b9a095c015a8afe42b46af2c94757', 'DAI'],
    });

    return feeData.result.totalFee / 1e18;
  };

  sdk.register({
    id: 'zksync-v1',
    queries: {
      feeTransferEth: getFeeForTransfer,
      feeTransferERC20: getFeeForTransfer,
      // feeSwap: getFeeResolverForCost(2602626),
      oneDayGasFeesPaid: getRollupSpenders(sdk, 'zksync'),
    },
    metadata: {
      icon: sdk.ipfs.getDataURILoader(
        'QmXeCkZTkG8nuNAMbNykxfu1ybJHyDsu8EgVJ7RKuza5WA',
        'image/svg+xml'
      ),
      category: 'l2',
      name: 'ZKSync',
      description: 'ZKSync is a ZK Rollup that supports transfers of any token',
      l2BeatSlug: 'zksync',
      website: 'https://zksync.io',
    },
  });
}
