import React, { useState } from 'react';
import { NextPage, GetStaticProps } from 'next';
import 'data/adapters';
import sdk from 'data/sdk';
import List from 'components/List';
import SocialTags from 'components/SocialTags';
import ToggleNavBar from 'components/ToggleNavBar';
import ToggleBar from 'components/ToggleBar';

interface HomeProps {
  data: any[];
}

export const Home: NextPage<HomeProps> = ({ data }) => {
  const [mode, setMode] = useState('rollups')

  let _data = mode === 'rollups' ? data.filter(item => item.id !== 'metisnetwork') : data

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
            { value: 'rollups', label: 'Rollups' },
            { value: 'l2s', label: 'All L2s' },
          ]}
          small
          selected={mode}
          onChange={(newMode) => setMode(newMode)}
        />
      </div>

      <List data={_data} />

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
  const list = sdk.getCollection('l2-fees');
  await list.fetchAdapters();

  const data = await list.executeQueriesWithMetadata(
    ['feeTransferEth', 'feeTransferERC20', 'feeSwap'],
    { allowMissingQuery: true }
  );

  return { props: { data }, revalidate: 5 * 60 };
};

export default Home;
