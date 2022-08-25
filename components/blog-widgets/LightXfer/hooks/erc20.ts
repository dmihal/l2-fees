import { useWeb3React } from '@web3-react/core';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

const ERC20_ABI = [
  'function allowance(address, address) external view returns (uint256)',
  'function approve(address, uint256) external returns (bool)',
  'function balanceOf(address) external view returns (uint256)',
  'function decimals() external view returns (uint8)',
];

const MAX_INT = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';

export const useApproval = (
  token: string | null,
  sender: string | null,
  amount: string
): [boolean, () => Promise<void> | null] => {
  const { library, account } = useWeb3React();

  const [approvedAmt, setApprovedAmt] = useState<null | string>(null);
  const contract = token && library && new ethers.Contract(token, ERC20_ABI, library.getSigner());

  useEffect(() => {
    if (account && token && sender && library) {
      contract.allowance(account, sender).then((amt: string) => setApprovedAmt(amt));
    }
  }, [account, token, sender, library]);

  const approved = amount && approvedAmt && ethers.BigNumber.from(approvedAmt).gte(amount);
  const approve: () => Promise<void> | null =
    contract && sender
      ? () =>
          contract
            .approve(sender, MAX_INT)
            .then((tx: any) => tx.wait())
            .then(() => setApprovedAmt(amount))
      : null;

  return [approved, approve];
};

export const useDecimals = (token?: string | null, amount?: string | null): string | null => {
  const { library, account } = useWeb3React();

  const [parsedAmount, setAmount] = useState<null | string>(null);
  const contract = token && library && new ethers.Contract(token, ERC20_ABI, library.getSigner());

  useEffect(() => {
    setAmount(null);
    if (account && token && library && amount && amount.length > 0) {
      contract
        .decimals()
        .then((decimals: string) =>
          setAmount(ethers.utils.parseUnits(amount, decimals).toHexString())
        );
    }
  }, [account, token, library, amount]);

  return parsedAmount;
};

export const useBalance = (token: string | null): string | null => {
  const { library, account } = useWeb3React();

  const [amt, setAmt] = useState<null | string>(null);
  const contract = token && library && new ethers.Contract(token, ERC20_ABI, library.getSigner());

  useEffect(() => {
    if (account && token && library) {
      Promise.all([contract.balanceOf(account), contract.decimals()]).then(([amt, decimals]) =>
        setAmt(ethers.utils.formatUnits(amt, decimals))
      );
    }
  }, [account, token, library]);

  return amt;
};
