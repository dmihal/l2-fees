import { Context } from '@cryptostats/sdk';

export function setup(sdk: Context) {
  const getFeeForTransfer = async () => {
    const feeData = await sdk.http.get('https://api.aztec.network/falafel-mainnet/status');

    return feeData.txFees[1].baseFeeQuotes[0].fee / 1e18;
  };

  sdk.register({
    id: 'aztec',
    queries: {
      feeTransferEth: getFeeForTransfer,
      feeTransferERC20: getFeeForTransfer,
    },
    metadata: {
      icon: sdk.ipfs.getDataURILoader(
        'QmaaYiAtFKGPeHRR629yQqkDAqzcpywfbEjun5KmhE6QH1',
        'image/svg+xml'
      ),
      category: 'l2',
      name: 'Aztec Protocol',
      description:
        'Aztec is an open-source ZK-Rollup that provides both scalable and private token transfers.',
      l2BeatSlug: 'aztec',
      website: 'https://aztec.network',
      flags: {
        private: 'Transactions on Aztec are private.',
      },
    },
  });
}
