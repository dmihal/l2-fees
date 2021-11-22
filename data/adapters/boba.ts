import { Context } from '@cryptostats/sdk';

export function setup(sdk: Context) {
  const provider = sdk.ethers.getProvider('boba');

  const getTransferEthCost = async () => {
    const l2GasPrice = await provider.getGasPrice();
    const l2GasEstimate = await provider.estimateGas({
      from: '0x5E7a06025892d8Eef0b5fa263fA0d4d2E5C3B549',
      to: '0x5E7a06025892d8Eef0b5fa263fA0d4d2E5C3B549',
      value: '0x38d7ea4c68000',
    });
    const totalGasCostWei = l2GasPrice.mul(l2GasEstimate).toNumber();
    const ethPrice = await sdk.coinGecko.getCurrentPrice('ethereum');
    return (totalGasCostWei * ethPrice) / 1e18;
  };

  const getTransferTokenCost = async () => {
    const l2GasPrice = await provider.getGasPrice();
    const l2GasEstimate = await provider.estimateGas({
      from: '0x5E7a06025892d8Eef0b5fa263fA0d4d2E5C3B549',
      to: '0x5E7a06025892d8Eef0b5fa263fA0d4d2E5C3B549',
      data:
        '0xa9059cbb0000000000000000000000005e7a06025892d8eef0b5fa263fa0d4d2e5c3b54900000000000000000000000000000000000000000000000000038d7ea4c68000',
    });
    const totalGasCostWei = l2GasPrice.mul(l2GasEstimate).toNumber();
    const ethPrice = await sdk.coinGecko.getCurrentPrice('ethereum');
    return (totalGasCostWei * ethPrice) / 1e18;
  };

  const getSwapCost = async () => {
    const l2GasPrice = await provider.getGasPrice();
    const l2GasEstimate = await provider.estimateGas({
      from: '0x5E7a06025892d8Eef0b5fa263fA0d4d2E5C3B549',
      to: '0x17C83E2B96ACfb5190d63F5E46d93c107eC0b514',
      value: '0x38d7ea4c68000',
      data:
        '0x7ff36ab500000000000000000000000000000000000000000000000000a80d439459704900000000000000000000000000000000000000000000000000000000000000800000000000000000000000005e7a06025892d8eef0b5fa263fa0d4d2e5c3b54900000000000000000000000000000000000000000000000000000000619c152b0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000deaddeaddeaddeaddeaddeaddeaddeaddead0000000000000000000000000000e1e2ec9a85c607092668789581251115bcbd20de',
    });
    const totalGasCostWei = l2GasPrice.mul(l2GasEstimate).toNumber();
    const ethPrice = await sdk.coinGecko.getCurrentPrice('ethereum');
    return (totalGasCostWei * ethPrice) / 1e18;
  };

  sdk.register({
    id: 'bobanetwork',
    queries: {
      feeTransferEth: getTransferEthCost,
      feeTransferERC20: getTransferTokenCost,
      feeSwap: getSwapCost,
    },
    metadata: {
      icon: sdk.ipfs.getDataURILoader(
        'QmTxXwaBgJdtZdKTfarQAzsxrBBeWioAfzqWHgpoC7eU7b',
        'image/png'
      ),
      category: 'l2',
      name: 'Boban Network',
      description:
        'Boba is an Optimistic Rollup scaling solution that claims to reduce gas fees, improve transaction throughput, and extend the capabilities of smart contracts.',
      l2BeatSlug: 'boba',
      website: 'https://boba.network',
      flags: {
        throtle: 'Boba is throttled while in beta. Fees will decrease as this throttle is lifted.',
      },
    },
  });
}
