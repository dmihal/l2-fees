import React from 'react';
import L1Row from './L1Row';

interface ListProps {
  data: any[];
}

const L1List: React.FC<ListProps> = ({ data }) => {
  const sortedData = data
    .filter((protocol: any) => !!protocol.result)
    .sort((a: any, b: any) => b.result - a.result);

  const total = data.reduce((total: number, row: any) => total + (row.result || 0), 0);

  return (
    <div className="list">
      <div className="header">
        <div className="name">Name</div>
        <div className="amount">One day security costs</div>
      </div>

      {sortedData.map((protocol: any) => (
        <L1Row protocol={protocol} key={protocol.id} />
      ))}
      <L1Row total protocol={{ metadata: { name: 'Total' }, result: total }} />

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

        .item {
          display: flex;
          padding: 0 4px;
          background-color: #fff;
          font-size: 18px;
          background-repeat: no-repeat;
          background-position: 10px center;
          background-size: 20px 20px;
          padding-left: 10px;
        }

        .item.app {
          background-color: #fad3f6;
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

          .item {
            padding-left: 30px;
            padding-right: 0;
            background-position: 6px center;
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

export default L1List;
