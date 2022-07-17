import React, { useState } from 'react';
import { NextPage, GetStaticProps } from 'next';
import sdk from 'data/sdk';
import List from 'components/List';
import SocialTags from 'components/SocialTags';
import ToggleNavBar from 'components/ToggleNavBar';
import ToggleBar from 'components/ToggleBar';
import AverageFeeChart from 'components/AverageFeeChart';

interface HomeProps {
  data: any[];
  historicData: any[];
}

export const Home: NextPage<HomeProps> = ({ data, historicData }) => {
  const [mode, setMode] = useState('l2s');

  let _data = mode === 'rollups' ? data.filter((item) => item.id !== 'metisnetwork') : data;
  _data = _data.map((item) => (item.id === 'metisnetwork' ? { ...item, offchainDA: true } : item));

  return (
    <main>
      <SocialTags />

      <h1 className="title">L2 Fees</h1>

      <ToggleNavBar
        options={[
          { path: '/', label: 'L2 Transaction Fees' },
          { path: '/l1-fees', label: 'Total L1 Security Costs' },
        ]}
      />

      <p className="description">
        Ethereum Layer-1 is expensive.
        <br />
        How much does it cost to use Layer-2?
      </p>

      <p className="heart">
        <a href="https://cryptofees.info">CryptoFees.info</a>
        {' + '}
        <a href="https://l2beat.com">L2Beat.com</a>
        {' = ❤️'}
      </p>

      <div className="toolbar">
        <ToggleBar
          options={[
            { value: 'l2s', label: 'All L2s' },
            { value: 'rollups', label: 'Full Rollups' },
          ]}
          small
          selected={mode}
          onChange={(newMode) => setMode(newMode)}
        />
      </div>

      <List data={_data} />

      <AverageFeeChart data={historicData} />

      <style jsx>{`
        main {
          padding: 2rem 0 3rem;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 100%;
        }

        .title {
          margin: 0 0 16px;
          line-height: 1.15;
          font-size: 4rem;
          font-weight: 700;
        }

        .title,
        .description {
          text-align: center;
          max-width: 800px;
        }

        .description {
          line-height: 1.5;
          font-size: 1.5rem;
          margin: 4px 0 20px;
        }

        .heart {
          margin: 0 0 18px 0;
          font-size: 18px;
          font-style: italic;
        }

        .toolbar {
          max-width: 600px;
          width: 100%;
          display: flex;
          justify-content: flex-end;
        }
      `}</style>
    </main>
  );
};

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const collection = sdk.getCollection('l2-fees');
  const l1Adapters = sdk.getCollection('l1-fees');
  const historicFeeCollection = sdk.getCollection('historic-l2-fees');
  await Promise.all([
    collection.fetchAdapters(),
    l1Adapters.fetchAdapters(),
    historicFeeCollection.fetchAdapters(),
  ]);

  const ethAdapter = l1Adapters.getAdapter('ethereum');
  if (!collection.getAdapter('ethereum')) {
    collection.addAdapter(ethAdapter);
  }
  if (!historicFeeCollection.getAdapter('ethereum')) {
    historicFeeCollection.addAdapter(ethAdapter);
  }

  // const dateRange = sdk.date.getDateRange('2021-09-01', sdk.date.formatDate(new Date()));
  const dateRange = sdk.date.getDateRange('2022-06-01', sdk.date.formatDate(new Date()));

  const [data, historicData] = await Promise.all([
    collection.executeQueriesWithMetadata(
      ['feeTransferEth', 'feeTransferERC20', 'feeSwap'],
      { allowMissingQuery: true }
    ),
    Promise.all(dateRange.map(async date => {
      const dayData = await historicFeeCollection.executeQuery('oneDayAverageFeeSwap', date);

      const result: any = { date: sdk.date.dateToTimestamp(date) };
      for (const protocol of dayData) {
        result[protocol.id] = protocol.result;
      }
      return result;
    })),
  ]);

  return { props: { data, historicData }, revalidate: 5 * 60 };
};

export default Home;
