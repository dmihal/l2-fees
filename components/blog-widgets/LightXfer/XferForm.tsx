import { useWeb3React } from '@web3-react/core';
import React, { useEffect, useState } from 'react';
import { useBalance } from './hooks/erc20';
import { useXfer, Mode, State } from './hooks/xfer';
import ModeSelector from './ModeSelector';
import SwitchNet from './SwitchNet';

const ARBITRUM_CHAINID = 42161;
const ARBITRUM_TESTNET_CHAINID = 421611;

const tokensByChain = {
  [ARBITRUM_CHAINID]: [
    // Arbitrum
    { name: 'Dai', address: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1' },
    { name: 'USDC', address: '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8' },
  ],
  [ARBITRUM_TESTNET_CHAINID]: [
    // Arbitrum testnet
    { name: 'Dai', address: '0x5364Dc963c402aAF150700f38a8ef52C1D7D7F14' },
    { name: 'UNI', address: '0x049251A7175071316e089D0616d8B6aaCD2c93b8' },
  ],
};

const XferForm = () => {
  const { chainId } = useWeb3React();
  const [token, setToken] = useState<string | undefined>();
  const [amount, setAmount] = useState('0');
  const [to, setTo] = useState('');
  const [mode, setMode] = useState(Mode.BASELINE);
  const { approve, state, result, calldata, send, deploy, register } = useXfer(
    token,
    amount,
    to,
    mode
  );
  const balance = useBalance(token);

  useEffect(() => {
    setToken(tokensByChain[chainId] && tokensByChain[chainId][0].address);
  }, [chainId]);

  let disabled = false;
  let canSend = false;
  let onClick = () => null;
  let label = 'Send';
  let statusMessage = '';
  let details: string | React.ReactNode = '';

  switch (state) {
    case State.DISCONNECTED:
      statusMessage = 'Disconnected';
      details = 'Connect your wallet to begin';
      break;

    case State.WRONG_NETWORK:
      disabled = true;
      statusMessage = 'Wrong network';
      details = (
        <>
          Connect your wallet to Arbitrum {}
          <SwitchNet chain="arbitrum">(switch)</SwitchNet>
          {} or the Arbitrum Testnet {}
          <SwitchNet chain="arbitrum-testnet">(switch)</SwitchNet>
        </>
      );
      break;

    case State.NOT_READY:
      details = 'Set an amount and recipient to start';
      break;

    case State.REGISTER_PENDING:
      disabled = true;
      label = 'Register';
      statusMessage = 'Register address in address-table';
      details = 'Register the address in the Arbitrum';
      break;

    case State.REGISTER:
      canSend = true;
      label = 'Register';
      statusMessage = 'Register address in address-table';
      details = 'Register the address in the Arbitrum';
      onClick = register;
      break;

    case State.APPROVE_PENDING:
      label = 'Approve';
      disabled = true;
      break;

    case State.APPROVE:
      canSend = true;
      label = 'Approve';
      statusMessage = 'Approve the token to be transferred';
      details = '(This transaction is not compressed)';
      onClick = approve;
      break;

    case State.DEPLOY_PENDING:
      label = 'Deploy Proxy';
      statusMessage = 'Deploy the proxy contract';
      details = 'Deploy a "helper" contract, which only needs to be deployed once per token';
      disabled = true;
      break;

    case State.DEPLOY:
      canSend = true;
      label = 'Deploy Proxy';
      statusMessage = 'Deploy the proxy contract';
      details = 'Deploy a "helper" contract, which only needs to be deployed once per token';
      onClick = deploy;
      break;

    case State.READY:
      canSend = true;
      label = 'Send';
      onClick = send;
      break;

    case State.DONE:
      statusMessage = 'Transaction complete!';
      details = (
        <>
          <div>Your transaction was sequenced, consuming {result.consumed} gas</div>
          <div>
            <a
              href={`https://${
                chainId === ARBITRUM_TESTNET_CHAINID ? 'testnet.' : ''
              }arbiscan.io/tx/${result.tx}`}
              target="arbiscan"
            >
              View on Etherscan
            </a>
          </div>
        </>
      );

      canSend = true;
      label = 'Send';
      onClick = send;
      break;
  }

  const donate = (e: any) => {
    e.preventDefault();
    setTo('0x392aCFD0792C32222edF31C20dD0Cc51528bb9Ea');
  };
  const useMax = (e: any) => {
    e.preventDefault();
    setAmount(balance);
  };

  return (
    <div className="container">
      <h2>{statusMessage}</h2>
      <div>{details}</div>
      {/* <div>{State[state]}</div> */}

      <fieldset>
        <legend>Token</legend>
        <select value={token} onChange={(e) => setToken(e.target.value)}>
          {tokensByChain[chainId]?.map((token) => (
            <option key={token.address} value={token.address}>
              {token.name}
            </option>
          ))}
        </select>
      </fieldset>

      <fieldset>
        <legend>Optimization mode</legend>
        <ModeSelector
          name="Control case"
          description="A normal token transfer, without any optimizations"
          selected={mode === Mode.BASELINE}
          onClick={() => setMode(Mode.BASELINE)}
          disabled={disabled}
        />
        <ModeSelector
          name="Reduced Calldata"
          description="All padding, as well as the function signature, is removed from the calldata"
          selected={mode === Mode.COMPRESSED}
          onClick={() => setMode(Mode.COMPRESSED)}
          disabled={disabled}
        />
        <ModeSelector
          name="Helper contract"
          description="A helper contract (deployed once) allows an address to be omitted from calldata"
          selected={mode === Mode.PROXY}
          onClick={() => setMode(Mode.PROXY)}
          disabled={disabled}
        />
        <ModeSelector
          name="Address table"
          description="Full addresses are replaced with minimal integers, registered in the Arbitrum address table"
          selected={mode === Mode.REGISTRY}
          onClick={() => setMode(Mode.REGISTRY)}
          disabled={disabled}
        />
        <ModeSelector
          name="Helper contract + address table"
          description="The two techniques combined"
          selected={mode === Mode.PROXY_REGISTRY}
          onClick={() => setMode(Mode.PROXY_REGISTRY)}
          disabled={disabled}
        />
      </fieldset>

      <fieldset>
        <legend>Transfer amount</legend>
        <input
          type="number"
          placeholder="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={disabled}
        />
        <div>
          Balance: {}
          <a href="#" onClick={useMax}>
            {balance}
          </a>
        </div>
      </fieldset>

      <fieldset>
        <legend>Recipient address</legend>
        <input
          placeholder="to"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          disabled={disabled}
        />
        <div>
          <a href="#" onClick={donate}>
            Donate to L2Fees.info
          </a>
        </div>
      </fieldset>

      <fieldset>
        <legend>Calldata</legend>
        <pre className="calldata">
          {calldata}
          {'\n'}({calldata.length / 2 - 2} bytes)
        </pre>
      </fieldset>

      <button disabled={disabled || !canSend} onClick={onClick}>
        {label}
      </button>

      <style jsx>{`
        .container {
          border: groove 4px #7c7c7c;
          padding: 4px;
          background: gray;
          margin: 4px 0;
        }
        .calldata {
          word-break: break-all;
          white-space: pre-wrap;
        }
      `}</style>
    </div>
  );
};

export default XferForm;
