import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { useApproval, useDecimals } from './erc20';
import { useRegistryId } from './registry';

const factoriesByChain = {
  42161: '0x6A50a0181B3dB71f485b9BC512CF2c10F2c2889A', // Arbitrum
  421611: '0x293cF779f4f9884E9f8e4C36a78611F3454E7617', // Arbitrum testnet
};

const FACTORY_ABI = [
  'function baselineTransferFrom(address token, address to, uint256 amount) external',
  'function calculateTokenContract(address token) public view returns (address predictedAddress)',
  'function createTokenContract(address token) public',
];

const useProxy = (token?: string | null, factoryAddress?: string) => {
  const [state, setState] = useState<{ proxyAddress: string | null; proxyExists: boolean }>({
    proxyAddress: null,
    proxyExists: false,
  });
  const { library } = useWeb3React();

  useEffect(() => {
    if (token) {
      setState({ proxyAddress: null, proxyExists: false });
      const factory = new ethers.Contract(factoryAddress, FACTORY_ABI, library);
      factory.calculateTokenContract(token).then(async (proxyAddress: string) => {
        const code = await library.getCode(proxyAddress);
        // eslint-disable-next-line
        console.log({ proxyAddress, code });
        setState({ proxyAddress, proxyExists: code !== '0x' });
      });
    }
  }, [token]);

  const deployProxy = async () => {
    const factory = new ethers.Contract(factoryAddress, FACTORY_ABI, library.getSigner());
    const tx = await factory.createTokenContract(token);
    await tx.wait();
    setState({ proxyAddress: state.proxyAddress, proxyExists: true });
  };

  return {
    ...state,
    deployProxy,
  };
};

export enum Mode {
  BASELINE,
  COMPRESSED,
  PROXY,
  REGISTRY,
  PROXY_REGISTRY,
}

export enum State {
  DISCONNECTED,
  WRONG_NETWORK,
  NOT_READY,
  APPROVE,
  APPROVE_PENDING,
  DEPLOY,
  DEPLOY_PENDING,
  REGISTER,
  REGISTER_PENDING,
  READY,
  PENDING,
  DONE,
}

interface StateValues {
  state: State;
  proxy: string | null;
}

function padNumber(num: number | string, padAmount?: number) {
  const amountHex = ethers.utils.hexValue(ethers.BigNumber.from(num));
  const _padAmount = Math.max(padAmount || 0, Math.floor(amountHex.length / 2));
  return ethers.utils.arrayify(ethers.utils.hexZeroPad(amountHex, _padAmount));
}

export const useXfer = (token?: string, amount?: string, to?: string, mode?: Mode) => {
  const { chainId, library, account } = useWeb3React();
  const [state, setState] = useState<StateValues>({
    proxy: null,
    state: State.NOT_READY,
  });
  const [result, setResult] = useState({ consumed: '', tx: '' });

  const usesProxy = mode === Mode.PROXY || mode === Mode.PROXY_REGISTRY;
  const usesRegistry = mode === Mode.REGISTRY || mode === Mode.PROXY_REGISTRY;

  const factoryAddress = factoriesByChain[chainId];
  const factory =
    factoryAddress && new ethers.Contract(factoryAddress, FACTORY_ABI, library?.getSigner());

  const { proxyAddress, proxyExists, deployProxy } = useProxy(
    usesProxy ? token : null,
    factoryAddress
  );
  const { id: tokenId, register: registerToken } = useRegistryId(
    mode === Mode.REGISTRY ? token : null
  );
  const { id: toId, register: registerTo } = useRegistryId(usesRegistry ? to : null);
  const convertedAmount = useDecimals(token, amount);

  let send = async () => null;

  const completeTx = async (tx: any) => {
    const receipt = await tx.wait();
    setResult({
      consumed: receipt.gasUsed.toString(),
      tx: tx.hash,
    });
    setState({
      state: State.DONE,
      proxy: state.proxy,
    });
  };

  let tokenTransferrer: string | null = null;
  let calldata = '';
  switch (mode) {
    case Mode.PROXY:
      tokenTransferrer = proxyAddress;

      calldata = ethers.utils.hexlify(
        ethers.utils.concat([
          to.length > 0 ? to : padNumber(0, 20),
          padNumber(convertedAmount || 0),
        ])
      );

      send = () =>
        library
          .getSigner()
          .sendTransaction({
            to: proxyAddress,
            data: ethers.utils.concat([to, padNumber(convertedAmount)]),
          })
          .then(completeTx);
      break;

    case Mode.BASELINE:
      tokenTransferrer = factoryAddress;

      calldata =
        '0x4232f461' +
        ethers.utils.hexlify(
          ethers.utils.concat([
            padNumber(0, 12),
            token ? token : padNumber(0, 20),
            padNumber(0, 12),
            to.length > 0 ? to : padNumber(0, 20),
            padNumber(convertedAmount || 0, 32),
          ])
        );

      send = () => factory.baselineTransferFrom(token, to, convertedAmount).then(completeTx);
      break;

    case Mode.COMPRESSED:
      tokenTransferrer = factoryAddress;

      calldata = ethers.utils.hexlify(
        ethers.utils.concat([
          token ? token : padNumber(0, 20),
          to.length > 0 ? to : padNumber(0, 20),
          padNumber(convertedAmount || 0),
        ])
      );

      send = () =>
        library
          .getSigner()
          .sendTransaction({
            to: factory.address,
            data: ethers.utils.concat([token, to, padNumber(convertedAmount)]),
          })
          .then(completeTx);
      break;

    case Mode.REGISTRY:
      tokenTransferrer = factoryAddress;

      calldata = ethers.utils.hexlify(
        ethers.utils.concat([
          padNumber(tokenId || 0, 3),
          padNumber(toId || 0, 3),
          padNumber(convertedAmount || 0),
        ])
      );

      send = () =>
        library
          .getSigner()
          .sendTransaction({
            to: factory.address,
            gasLimit: 1000000,
            data: ethers.utils.concat([
              padNumber(tokenId, 3),
              padNumber(toId, 3),
              padNumber(convertedAmount),
            ]),
          })
          .then(completeTx);
      break;

    case Mode.PROXY_REGISTRY:
      tokenTransferrer = proxyAddress;

      calldata = ethers.utils.hexlify(
        ethers.utils.concat([padNumber(toId || 0, 3), padNumber(convertedAmount || 0)])
      );

      send = () =>
        library
          .getSigner()
          .sendTransaction({
            to: proxyAddress,
            gasLimit: 1000000,
            data: ethers.utils.concat([padNumber(toId, 3), padNumber(convertedAmount)]),
          })
          .then(completeTx);
      break;
  }

  const [approved, _approve] = useApproval(token, tokenTransferrer, convertedAmount);

  useEffect(() => {
    if (approved && state.state === State.APPROVE) {
      setState((_state) => ({ ..._state, state: State.READY }));
    }
  }, [approved, state.state]);

  const approve = async () => {
    setState((_state) => ({ ..._state, state: State.APPROVE_PENDING }));
    try {
      await _approve();
      setState((_state) => ({ ..._state, state: State.READY }));
    } catch (e) {
      // eslint-disable-next-line
      console.warn(e);
      setState((_state) => ({ ..._state, state: State.APPROVE }));
    }
  };

  const deploy = async () => {
    await deployProxy();
    setState((_state) => ({ ..._state, state: State.APPROVE }));
  };

  const register = async () => {
    setState((_state) => ({ ..._state, state: State.REGISTER_PENDING }));
    await registerTo();
    if (mode === Mode.REGISTRY) {
      await registerToken();
    }
    setState((_state) => ({ ..._state, state: State.APPROVE }));
  };

  useEffect(() => {
    if (!account) {
      setState({ proxy: null, state: State.DISCONNECTED });
      return;
    }

    if (!factoryAddress) {
      setState({ proxy: null, state: State.WRONG_NETWORK });
      return;
    }

    if (!token || !amount || !to || mode === undefined) {
      setState({ proxy: null, state: State.NOT_READY });
      return;
    }
    // console.log({usesProxy, proxyExists})
    if (usesProxy && !proxyExists) {
      setState({ proxy: null, state: State.DEPLOY });
      return;
    }

    // eslint-disable-next-line
    console.log({ tokenId, mode });
    if ((usesRegistry && !toId) || (mode === Mode.REGISTRY && !tokenId)) {
      setState({ proxy: null, state: State.REGISTER });
      return;
    }

    if (!approved) {
      setState({ proxy: null, state: State.APPROVE });
      return;
    }

    setState({ proxy: null, state: State.READY });
  }, [token, amount, to, mode, approved, proxyExists, toId, tokenId, account]);

  return { state: state.state, result, calldata, approve, deploy, register, send };
};
