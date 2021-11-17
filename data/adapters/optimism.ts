import { Context } from '@cryptostats/sdk';

/*
Fees are calculated as follows (https://community.optimism.io/docs/users/fees-2.0.html):

Total transaction fee is a combination of an "L2 execution fee" and an "L1 security fee":

total_fee = (l2_gas_price * l2_gas_used) + (l1_gas_price * l1_gas_used)

Where:
- `l2_gas_price` corresponds to the cost of execution on L2
- `l2_gas_used` corresponds to the amount of gas used on L2
- `l1_gas_price` corresponds to the cost of publishing the transaction data on L1
- `l1_gas_used` corresponds to the amount of transaction data published on L1
*/

const OP_GAS_PREDEPLOY = '0x420000000000000000000000000000000000000F';

const OP_GAS_ABI = [
  {
    inputs: [
      {
        internalType: 'bytes',
        name: '_data',
        type: 'bytes',
      },
    ],
    name: 'getL1Fee',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];

export function setup(sdk: Context) {
  const provider = sdk.ethers.getProvider('optimism');
  const gasPredeployContract = sdk.ethers.getContract(OP_GAS_PREDEPLOY, OP_GAS_ABI, 'optimism');

  const getTransferEthCost = async () => {
    const l2GasPrice = await provider.getGasPrice();
    const l2GasEstimate = await provider.estimateGas({
      from: '0xbeefbeefbeefbeefbeefbeefbeefbeefbeefbeef', // Address has enough ETH that this won't fail
      to: '0xcafebeefcafebeefcafebeefcafebeefcafebeef',
      value: '0x38d7ea4c68000', // 0.001 ETH
    });
    const l1GasCost = await gasPredeployContract.getL1Fee(
      sdk.ethers.utils.serializeTransaction({
        nonce: 1234,
        value: '0x38d7ea4c68000', // 0.001 ETH
        gasPrice: l2GasPrice,
        gasLimit: l2GasEstimate,
        to: '0xcafebeefcafebeefcafebeefcafebeefcafebeef',
        data: '0x',
      })
    );
    const totalGasCostWei = l2GasPrice.mul(l2GasEstimate).add(l1GasCost).toNumber();
    const ethPrice = await sdk.coinGecko.getCurrentPrice('ethereum');
    return (totalGasCostWei * ethPrice) / 1e18;
  };

  const getTransferTokenCost = async () => {
    const l2GasPrice = await provider.getGasPrice();
    const l2GasEstimate = await provider.estimateGas({
      from: '0x11e4857bb9993a50c685a79afad4e6f65d518dda', // Random account with USDT
      to: '0x94b008aa00579c1307b0ef2c499ad98a8ce58e58', // USDT Contract
      data:
        '0xa9059cbb00000000000000000000000023e7039c34c7aa47a0d4e975fbc789e0f763fa640000000000000000000000000000000000000000000000000000000000000001',
    });
    const l1GasCost = await gasPredeployContract.getL1Fee(
      sdk.ethers.utils.serializeTransaction({
        nonce: 1234,
        value: '0x',
        gasPrice: l2GasPrice,
        gasLimit: l2GasEstimate,
        to: '0x94b008aa00579c1307b0ef2c499ad98a8ce58e58',
        data:
          '0xa9059cbb00000000000000000000000023e7039c34c7aa47a0d4e975fbc789e0f763fa640000000000000000000000000000000000000000000000000000000000000001',
      })
    );
    const totalGasCostWei = l2GasPrice.mul(l2GasEstimate).add(l1GasCost).toNumber();
    const ethPrice = await sdk.coinGecko.getCurrentPrice('ethereum');
    return (totalGasCostWei * ethPrice) / 1e18;
  };

  const getSwapCost = async () => {
    const l2GasPrice = await provider.getGasPrice();
    const l2GasEstimate = await provider.estimateGas({
      from: '0x11e4857bb9993a50c685a79afad4e6f65d518dda', // Random account with USDT
      to: '0xe592427a0aece92de3edee1f18e0157c05861564', // Uniswap Router
      data:
        '0x414bf38900000000000000000000000094b008aa00579c1307b0ef2c499ad98a8ce58e58000000000000000000000000da10009cbd5d07dd0cecc66161fc93d7c9000da100000000000000000000000000000000000000000000000000000000000001f4000000000000000000000000c9499bd14493f6d9006d6a13aca3098c786fe6b100000000000000000000000000000000000000000000000000000000912e6519000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
    });
    const l1GasCost = await gasPredeployContract.getL1Fee(
      sdk.ethers.utils.serializeTransaction({
        nonce: 1234,
        value: '0x',
        gasPrice: l2GasPrice,
        gasLimit: l2GasEstimate,
        to: '0xe592427a0aece92de3edee1f18e0157c05861564',
        data:
          '0x414bf38900000000000000000000000094b008aa00579c1307b0ef2c499ad98a8ce58e58000000000000000000000000da10009cbd5d07dd0cecc66161fc93d7c9000da100000000000000000000000000000000000000000000000000000000000001f4000000000000000000000000c9499bd14493f6d9006d6a13aca3098c786fe6b100000000000000000000000000000000000000000000000000000000912e6519000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
      })
    );
    const totalGasCostWei = l2GasPrice.mul(l2GasEstimate).add(l1GasCost).toNumber();
    const ethPrice = await sdk.coinGecko.getCurrentPrice('ethereum');
    return (totalGasCostWei * ethPrice) / 1e18;
  };

  sdk.register({
    id: 'optimism',
    queries: {
      feeTransferEth: getTransferEthCost,
      feeTransferERC20: getTransferTokenCost,
      feeSwap: getSwapCost,
    },
    metadata: {
      icon: sdk.ipfs.getDataURILoader(
        'QmS1mBxRRDjuVPAPkjrmrnVgzYwyfchjvRZTH11vgjqabG',
        'image/svg+xml'
      ),
      category: 'l2',
      name: 'Optimism',
      description:
        'Optimism is an EVM-compatible Optimistic Rollup chain. It aims to be fast, simple, and secure.',
      l2BeatSlug: 'optimism',
      website: 'https://optimism.io',
      flags: {
        throtle:
          'Optimism is throttled while in beta. Fees will decrease as this throttle is lifted.',
      },
    },
  });
}
