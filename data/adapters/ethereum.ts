import { Context } from '@cryptostats/sdk';

export function setup(sdk: Context) {
  const getFeeResolverForCost = (gasAmt: number) => async() => {
    const gasData = await sdk.http.get('https://www.gasnow.org/api/v3/gas/price');
    const ethPrice = await sdk.coinGecko.getCurrentPrice('ethereum');
    return gasData.data.fast * gasAmt * ethPrice / 1e18;
  }

  sdk.register({
    id: 'ethereum',
    queries: {
      feeTransferEth: getFeeResolverForCost(21000),
      feeTransferERC20: getFeeResolverForCost(48000),
      feeSwap: getFeeResolverForCost(105000),
    },
    metadata: {
      icon: sdk.ipfs.getDataURILoader('QmedJLPy6R7x3dDEy2cfMd8gXbZm9e3vxvgBLXp3YZEHCy', 'image/svg+xml'),
      category: 'l1',
      name: 'Ethererum',
      description: 'Ethereum is the base layer-1 chain.',
      website: 'https://ethereum.org',
    },
  });
}
