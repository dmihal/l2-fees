import { Context } from '@cryptostats/sdk';

export function setup(sdk: Context) {
  const getFeeForTransfer = async () => {
    const url = 'https://api.hermez.io/v1/state';
    const feeData = await sdk.http.get(url);

    return feeData.recommendedFee.existingAccount;
  };

  sdk.register({
    id: 'hermez',
    queries: {
      feeTransferEth: getFeeForTransfer,
      feeTransferERC20: getFeeForTransfer,
    },
    metadata: {
      icon: sdk.ipfs.getDataURILoader(
        'Qmbw7GjfMCHauojv5yKZnKTaWZi2p3D7fcetU8rqSoL54M',
        'image/svg+xml'
      ),
      category: 'l2',
      name: 'Polygon Hermez',
      description:
        'Polygon Hermez is an open-source ZK-Rollup that aims to be optimized for secure, low-cost and usable token transfers on the wings of Ethereum.',
      l2BeatSlug: 'hermez',
      website: 'https://hermez.io',
    },
  });
}
