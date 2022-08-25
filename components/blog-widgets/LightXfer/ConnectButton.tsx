import React, { useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';

import { InjectedConnector } from '@web3-react/injected-connector';

export const injected = new InjectedConnector({});

const getForceDisconnect = () => window.localStorage.getItem('force-disconnect') === 'true';

const setForceDisconnect = (val: boolean) =>
  window.localStorage.setItem('force-disconnect', val.toString());

const ConnectionButton: React.FC = () => {
  const { active, account, deactivate, activate } = useWeb3React();

  useEffect(() => {
    if (!active && !getForceDisconnect()) {
      injected.isAuthorized().then((isAuthorized) => {
        if (isAuthorized) {
          activate(injected, undefined, true);
        }
      });
    }
  }, [activate, active]);

  const disconnect = () => {
    setForceDisconnect(true);
    deactivate();
  };

  const buttonHandler = account
    ? disconnect
    : () => activate(injected).then(() => setForceDisconnect(false));

  return (
    <button className="connect-button" onClick={buttonHandler}>
      {account ? `Connected to ${account.substring(0, 8)}` : 'Connect'}
    </button>
  );
};

export default ConnectionButton;
