import { useWeb3React } from '@web3-react/core';
import React from 'react';

interface SwitchNetProps {
  children: React.ReactNode;
  chain: string;
}

export default function SwitchNet({ children, chain }: SwitchNetProps) {
  const { library } = useWeb3React();
  const switchNetwork = (e: any) => {
    e.preventDefault();

    const payload =
      chain === 'arbitrum'
        ? {
            chainId: '0x66EEB',
            chainName: 'Arbitrum Testnet',
            nativeCurrency: {
              name: 'AETH',
              symbol: 'AETH',
              decimals: 18,
            },
            rpcUrls: ['https://rinkeby.arbitrum.io/rpc'],
            blockExplorerUrls: ['https://rinkeby-explorer.arbitrum.io/#/'],
          }
        : {
            chainId: '0xA4B1',
            chainName: 'Arbitrum One',
            nativeCurrency: {
              name: 'AETH',
              symbol: 'AETH',
              decimals: 18,
            },
            rpcUrls: ['https://arb1.arbitrum.io/rpc'],
            blockExplorerUrls: ['https://arbiscan.io'],
          };
    library.send('wallet_addEthereumChain', [payload]);
  };

  return (
    <a href="#" onClick={switchNetwork}>
      {children}
    </a>
  );
}
