import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';

const REGISTRY_ADDRESS = '0x0000000000000000000000000000000000000066';

const REGISTRY_ABI = [
  'function register(address addr) external returns (uint256)',
  'function lookup(address addr) external view returns (uint256)',
  'function addressExists(address addr) external view returns (bool)',
  'function lookupIndex(uint256 index) external view returns (address)',
];

export const useRegistryId = (address?: string | null) => {
  const { library } = useWeb3React();
  const [id, setId] = useState<null | number>(null);

  useEffect(() => {
    if (address) {
      setId(null);
      const registry = new ethers.Contract(REGISTRY_ADDRESS, REGISTRY_ABI, library);
      registry
        .lookup(address)
        .then((id: string) => setId(parseInt(id)))
        .catch(() => setId(null));
    }
  }, [address]);

  const register = async () => {
    const registry = new ethers.Contract(REGISTRY_ADDRESS, REGISTRY_ABI, library?.getSigner());
    const tx = await registry.register(address);
    await tx.wait();
    registry
      .lookup(address)
      .then((id: string) => setId(parseInt(id)))
      .catch(() => setId(null));
  };

  return { id, register };
};

// export const useBulkRegistryIds = (addresses: string[]) => {
//   const { library } = useWeb3React()
//   const [ids, setIds] = useState<null | number[]>(null)

//   useEffect(() => {
//     if (addresses) {
//       const registry = new ethers.Contract(REGISTRY_ADDRESS, REGISTRY_ABI, library)
//       registry.peekId(address).then((id: string) => setId(id === '0' ? null : parseInt(id)))
//     }
//   }, [addresses])

//   return { ids }
// }
