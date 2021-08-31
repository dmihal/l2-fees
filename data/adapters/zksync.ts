import { Context } from '@cryptostats/sdk';

export function setup(sdk: Context) {
  const getFeeForTransfer = async () => {
    const feeData = await sdk.http.post('https://api.zksync.io/jsrpc', {
      'jsonrpc': '2.0',
      id: 1,
      method: 'get_tx_fee',
      params: ["Transfer", "0xC8568F373484Cd51FDc1FE3675E46D8C0dc7D246", "DAI"],
    });

    return feeData.result.totalFee / 1e18;
  }

  sdk.register({
    id: 'zksync-v1',
    queries: {
      feeTransferEth: getFeeForTransfer,
      feeTransferERC20: getFeeForTransfer,
      // feeSwap: getFeeResolverForCost(2602626),
    },
    metadata: {
      icon: sdk.ipfs.getDataURILoader('QmXeCkZTkG8nuNAMbNykxfu1ybJHyDsu8EgVJ7RKuza5WA', 'image/svg+xml'),
      category: 'l2',
      name: 'ZKSync',
      description: 'ZKSync is a ZK Rollup that supports transfers of any token',
      l2BeatSlug: 'zksync',
      website: 'https://zksync.io',
    },
  });
}
