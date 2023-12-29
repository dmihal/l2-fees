import React, { useState } from 'react';
import Row, { TokenType } from './Row';

interface ListProps {
  data: any[];
}

const List: React.FC<ListProps> = ({ data }) => {
  const [tokenType, setTokenType] = useState(TokenType.ETH);
  const query = 'feeTransferEth';
  const sortedData = data
    .filter((protocol: any) => !!protocol.results[query])
    .sort((a: any, b: any) => a.results[query] - b.results[query]);

  return (
    <div className="list">
      <div className="header">
        <div className="name">Name</div>
        <div className="amount">
          Send {tokenType}
          <div className="dropdown">
            <ul>
              <li
                onClick={() => setTokenType(TokenType.ETH)}
                className={tokenType === TokenType.ETH ? 'selected' : ''}
              >
                ETH
              </li>
              <li
                onClick={() => setTokenType(TokenType.TOKEN)}
                className={tokenType === TokenType.TOKEN ? 'selected' : ''}
              >
                Tokens
              </li>
            </ul>
          </div>
        </div>
        <div className="amount">Swap tokens</div>
      </div>

      {sortedData.map((protocol: any) => (
        <Row protocol={protocol} key={protocol.id} query={query} transferType={tokenType} />
      ))}

      <style jsx>{`
        .list {
          border: solid 1px lightGray;
          border-radius: 0px;
          margin: 4px;
          max-width: 600px;
          width: 100%;
        }

        .header {
          display: flex;
          padding: 0 4px;
          border-bottom: solid 1px lightGray;
          background: #eee;
          font-weight: 500;
          padding-left: 10px;
        }

        .header .amount:hover {
          cursor: pointer;
          background: #eee;
        }

        .item > div,
        .header > div {
          padding: 16px 32px;
        }

        .name {
          flex: 1;
        }

        .amount {
          min-width: 160px;
          text-align: right;
          position: relative;
        }

        .dropdown {
          display: none;
          position: absolute;
          background: #eee;
          border: solid 1px darkGray;
          left: 0;
          right: 0;
          top: 55px;
        }

        .dropdown ul {
          margin: 0;
          padding: 0;
        }

        .dropdown ul li {
          padding: 6px;
          list-style: none;
        }

        .dropdown ul li:hover {
          background: #ddd;
        }

        .amount:hover .dropdown,
        .dropdown:hover {
          display: block;
        }

        @media (max-width: 700px) {
          .header {
            padding-left: 28px;
            padding-right: 30px;
          }
          .header > div {
            font-size: 14px;
          }

          .amount {
            font-size: 16px;
            min-width: 110px;
          }
          .name {
            font-size: 14px;
          }
          .g {
            display: none;
          }

          .item > div,
          .header > div {
            padding: 8px 2px;
          }
        }
      `}</style>
    </div>
  );
};

export default List;
