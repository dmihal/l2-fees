import { Web3ReactProvider } from '@web3-react/core';
import { ethers } from 'ethers';
import ConnectionButton from './ConnectButton';
import XferForm from './XferForm';

export default function LightXfer() {
  return (
    <Web3ReactProvider getLibrary={(provider: any) => new ethers.providers.Web3Provider(provider)}>
      <ConnectionButton />
      <XferForm />
    </Web3ReactProvider>
  );
}
