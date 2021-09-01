import { Context } from '@cryptostats/sdk';

export function setup(sdk: Context) {
  if (!process.env.LOOPRING_KEY) {
    console.warn('Loopring key not set, skipping module');
    return;
  }

  const [accountId, accountKey] = process.env.LOOPRING_KEY.split(':');

  const getFeeForTransfer = async () => {
    const url = `https://api3.loopring.io/api/v3/user/offchainFee?accountId=${accountId}&requestType=3&tokenSymbol=ETH&amount=10000000000`;
    const feeData = await sdk.http.get(url, {
      headers: {
        'X-API-KEY': accountKey,
      },
    });

    for (const feeToken of feeData.fees) {
      if (feeToken.token === 'USDC') {
        return feeToken.fee / 1e6;
      }
    }

    throw new Error('USDC fee not found');
  }

  sdk.register({
    id: 'loopring',
    queries: {
      feeTransferEth: getFeeForTransfer,
      feeTransferERC20: getFeeForTransfer,
    },
    metadata: {
      icon: sdk.ipfs.getDataURILoader('QmZC3WbPX77hYvh6EXuMiBAHBHd3M81EA4BJiKRLyL6vMk', 'image/svg+xml'),
      category: 'l2',
      name: 'Loopring',
      description: 'Loopring\'s zkRollup L2 solution aims to offer the same security guarantees as Ethereum mainnet, with a big scalability boost: throughput increased by 1000x, and cost reduced to just 0.1% of L1.',
      l2BeatSlug: 'loopring',
      website: 'https://loopring.io',
    },
  });
}
