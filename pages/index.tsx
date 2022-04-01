import React from 'react';
import { NextPage, GetStaticProps } from 'next';
import 'data/adapters';
import sdk from 'data/sdk';
import List from 'components/List';
import SocialTags from 'components/SocialTags';
import ToggleBar from 'components/ToggleNavBar';

interface HomeProps {
  data: any[];
}

export const Home: NextPage<HomeProps> = ({ data }) => {
  return (
    <main>
      <SocialTags />

      <h1 className="title">L2 Fees</h1>

      <ToggleBar
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

      <List data={data} />

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
      `}</style>
    </main>
  );
};

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const list = sdk.getList('l2-fees');
  await list.fetchAdapters();

  const data = await list.executeQueriesWithMetadata(
    ['feeTransferEth', 'feeTransferERC20', 'feeSwap'],
    { allowMissingQuery: true }
  );

  return { props: { data }, revalidate: 5 * 60 };
};

export default Home;
