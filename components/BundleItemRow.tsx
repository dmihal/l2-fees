import React, { Fragment } from 'react';
import { formatUSD } from 'utils';

interface BundleItemRowProps {
  item: any;
}

const BundleItemRow: React.FC<BundleItemRowProps> = ({ item }) => {
  return (
    <Fragment>
      <div
        className="bundle-item"
        style={{
          backgroundImage: item.metadata.icon ? `url('${item.metadata.icon}')` : undefined,
        }}
      >
        <div className="name">{item.metadata.name}</div>
        <div className="amount">{formatUSD(item.result)}</div>
      </div>
      <style jsx>{`
        .bundle-item {
          display: flex;
          background-repeat: no-repeat;
          background-position: 10px center;
          background-size: 20px 20px;
          padding: 4px;
          text-decoration: none;
          background-color: #eee;
        }
        .bundle-item:hover {
          background-color: #dddddd;
        }
        .name {
          padding-left: 32px;
          flex: 1;
        }
        .amount {
          min-width: 200px;
          text-align: right;
          font-family: 'Noto Sans TC', sans-serif;
        }
        .arrow {
          padding: 0 4px;
          height: 24px;
          opacity: 0.7;
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

export default BundleItemRow;
