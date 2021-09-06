import { Context } from '@cryptostats/sdk';

/*
This commented code is the way that things _should_ be calculated: by fetching gas prices
and calculating the fees the same way that a node calculates it.
- https://community.optimism.io/docs/developers/fees.html
- https://github.com/ethereum-optimism/optimism/blob/develop/l2geth/internal/ethapi/api.go#L1023
However, these calculations aren't working correctly, so we'll use eth_estimateGas as a temporary solution

function zeroesAndOnes(data: string) {
  let zeroes = 0;
  for (let i = 2; i < data.length; i += 2) {
    if (data.substr(i, 2) == '00') {
      zeroes++;
    }
  }
  const ones = ((data.length - 2) / 2) - zeroes;
  return { zeroes, ones };
}

const TOKEN_TRANSFER_INPUT = '0xa9059cbb0000000000000000000000001ee91f86cd818f8cfdc52bfc45a317b9cf4c2eaa000000000000000000000000000000000000000000000002b5e3af16b1880000';

    const gasData = await sdk.http.post('https://mainnet.optimism.io', {
      'json_rpc': '2.0',
      method: 'rollup_gasPrices',
    });
    const { l1GasPrice, l2GasPrice } = gasData.result;
    console.log(gasData);//{ l1GasPrice, l2GasPrice }

    const rollupBaseTxSize = 96;

    // (4 * zeroDataBytes + 16 * (nonZeroDataBytes + RollupBaseTxSize)) * l1GasPrice + (l2GasPrice * gasUsed)

    const { zeroes, ones } = zeroesAndOnes(txData);
    const rollupFee = (4 * zeroes + 16 * (ones + rollupBaseTxSize)) * l1GasPrice + (l2GasPrice * gasUsed);

    // const gasPriceInWei = parseInt(gasData.result);
    const ethPrice = await sdk.coinGecko.getCurrentPrice('ethereum');
    console.log({ fee: rollupFee / 1e18 })
    return rollupFee / (0.015 * 1e9) / 1e18 * ethPrice;
*/

const OPTIMISM_GAS_PRICE = 0.015;
const GWEI_IN_ETH = 1e9;

export function setup(sdk: Context) {
  const getTransferTokenCost = async () => {
    const estimate = await sdk.ethers.getProvider('optimism').estimateGas({
      from: '0x11e4857bb9993a50c685a79afad4e6f65d518dda', // Random account with USDT
      to: '0x94b008aa00579c1307b0ef2c499ad98a8ce58e58', // USDT Contract
      data: '0xa9059cbb00000000000000000000000023e7039c34c7aa47a0d4e975fbc789e0f763fa640000000000000000000000000000000000000000000000000000000000000001'
    });
    const ethFee = estimate.toNumber() * OPTIMISM_GAS_PRICE / GWEI_IN_ETH;
    const ethPrice = await sdk.coinGecko.getCurrentPrice('ethereum');

    return ethFee * ethPrice;
  }

  const getSwapCost = async () => {
    const estimate = await sdk.ethers.getProvider('optimism').estimateGas({
      from: '0x11e4857bb9993a50c685a79afad4e6f65d518dda', // Random account with USDT
      to: '0xe592427a0aece92de3edee1f18e0157c05861564', // Uniswap Router
      data: '0x414bf38900000000000000000000000094b008aa00579c1307b0ef2c499ad98a8ce58e58000000000000000000000000da10009cbd5d07dd0cecc66161fc93d7c9000da100000000000000000000000000000000000000000000000000000000000001f4000000000000000000000000c9499bd14493f6d9006d6a13aca3098c786fe6b100000000000000000000000000000000000000000000000000000000912e6519000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'
    });
    const ethFee = estimate.toNumber() * OPTIMISM_GAS_PRICE / GWEI_IN_ETH;
    const ethPrice = await sdk.coinGecko.getCurrentPrice('ethereum');

    return ethFee * ethPrice;
  }

  sdk.register({
    id: 'optimism',
    queries: {
      feeTransferEth: getTransferTokenCost,
      feeTransferERC20: getTransferTokenCost,
      feeSwap: getSwapCost,
    },
    metadata: {
      icon: sdk.ipfs.getDataURILoader('QmS1mBxRRDjuVPAPkjrmrnVgzYwyfchjvRZTH11vgjqabG', 'image/svg+xml'),
      category: 'l2',
      name: 'Optimism',
      description: 'Optimism is an EVM-compatible Optimistic Rollup chain. It aims to be fast, simple, and secure.',
      l2BeatSlug: 'optimism',
      website: 'https://optimism.io',
      flags: {
        throtle: 'Arbitrum One is throttled while in beta. Fees will decrease as this throttle is lifted.',
      },
    },
  });
}
