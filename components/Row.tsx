import React, { Fragment, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import { ChevronDown, ChevronUp } from 'lucide-react';
import DetailsCard from './DetailsCard';
import RowName from './RowName';
import Flags from './Flags';
import { usePlausible } from 'next-plausible';

interface RowProps {
  protocol: any;
  query: string;
  transferType: TokenType;
}

export enum TokenType {
  ETH = 'ETH',
  TOKEN = 'Tokens',
}

const toggle = (isOpen: boolean) => !isOpen;

const cardHeight = 600;

const minimumFractionDigits = 4;
const minimum = 1 / 10 ** minimumFractionDigits;

const format = (num?: number) =>
  (num &&
    (num < minimum
      ? `< $${minimum}`
      : num?.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits,
        }))) ||
  '-';

const Row = ({ protocol, query, transferType }: RowProps) => {
  const plausible = usePlausible();
  const [open, setOpen] = useState(false);

  const isApp = protocol.metadata.category !== 'l1';
  const isNotRollup = !!protocol.offchainDA;

  const flags = {
    ...protocol.metadata.flags,
    ...(protocol.metadata.flagsByQuery || {})[query],
  };

  const classes = ['item'];
  if (isApp) {
    classes.push('app');
  }
  if (open) {
    classes.push('open');
  }
  if (isNotRollup) {
    classes.push('not-rollup');
  }

  const transferAmount =
    transferType === TokenType.ETH
      ? protocol.results.feeTransferEth
      : protocol.results.feeTransferToken || protocol.results.feeTransferERC20;

  return (
    <Fragment>
      <div
        onClick={() => {
          setOpen(toggle);

          plausible(open ? 'close-details' : 'open-details', {
            props: {
              label: protocol.name,
            },
          });
        }}
        className={classes.join(' ')}
        style={{
          backgroundImage: protocol.metadata.icon ? `url('${protocol.metadata.icon}')` : undefined,
        }}
      >
        <div className="row-name">
          <RowName
            name={protocol.metadata.name}
            shortName={protocol.metadata.shortName}
            subtitle={protocol.metadata.subtitle}
          />
          <Flags flags={flags} />
        </div>
        <div className="amount">{format(transferAmount)}</div>
        <div className="amount">{format(protocol.results.feeSwap)}</div>
        <div className="arrow">{open ? <ChevronUp /> : <ChevronDown />}</div>
      </div>

      <CSSTransition in={open} timeout={500} unmountOnExit>
        <div className="details-container">
          <DetailsCard protocol={protocol} />
        </div>
      </CSSTransition>
      <style jsx>{`
        .item {
          display: flex;
          padding: 0 4px;
          background-color: #fff;
          font-size: 18px;
          background-repeat: no-repeat;
          background-position: 10px center;
          background-size: 20px 20px;
          padding-left: 10px;
          color: black;
          text-decoration: none;
          align-items: center;
          height: 54px;
          cursor: pointer;
        }
        .item:hover {
          background-color: #f5f5f5;
        }

        .item.app {
          background-color: #fad3f6;
        }
        .item.app:hover {
          background-color: #f8c3f3;
        }
        .item.not-rollup {
          background-color: #ede8ec;
          color: gray;
        }

        .row-name {
          flex: 1;
          display: flex;
          align-items: center;
        }

        .amount {
          padding-left: 32px;
          min-width: 160px;
          text-align: right;
          font-family: 'Noto Sans TC', sans-serif;
        }

        .arrow {
          padding: 0 4px;
          height: 24px;
          opacity: 0.7;
        }

        @keyframes slidein {
          from {
            max-height: 0px;
          }

          to {
            max-height: ${cardHeight}px;
          }
        }

        @keyframes slideout {
          from {
            max-height: ${cardHeight}px;
          }

          to {
            max-height: 0px;
          }
        }

        .details-container {
          max-height: ${cardHeight}px;
          animation: 0.5s 1 slidein;
          overflow: hidden;

          border-top: solid 1px #e3e3e3;
          border-bottom: solid 1px #e3e3e3;
          display: flex;
          flex-direction: column;
        }

        .details-container.exit {
          max-height: 0;
          animation: 0.5s 1 slideout;
        }

        @media (max-width: 700px) {
          .amount {
            font-size: 14px;
            min-width: 110px;
            padding-left: 8px;
          }

          .item {
            padding-left: 30px;
            background-position: 6px center;
          }

          .arrow {
            padding: 0 2px;
          }
        }
      `}</style>
    </Fragment>
  );
};

export default Row;
