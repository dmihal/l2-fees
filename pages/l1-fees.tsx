import React from 'react';
import { NextPage, GetStaticProps } from 'next';
import 'data/adapters';
import sdk from 'data/sdk';
import Button from 'components/Button';
import SocialTags from 'components/SocialTags';
import ToggleBar from 'components/ToggleBar';
import gtc from 'components/icons/gtc.svg';
import L1List from 'components/L1List';

interface HomeProps {
  data: any[];
}

const GTCIcon: React.FC = () => (
  <div className="gtc">
    <style jsx>{`
      .gtc {
        background: url('${gtc}');
        height: 18px;
        width: 18px;
        margin-right: 2px;
        flex: 0 0 18px;
      }
    `}</style>
  </div>
);

export const Home: NextPage<HomeProps> = ({ data }) => {
  return (
    <main>
      <SocialTags />

      <h1 className="title">L2 Fees</h1>

      <p className="description">How much are rollups paying for Ethereum&apos;s security?</p>

      <p className="heart">
        <a href="https://cryptofees.info">CryptoFees.info</a>
        {' + '}
        <a href="https://l2beat.com">L2Beat.com</a>
        {' = ❤️'}
      </p>

      <Button Icon={GTCIcon} target="gitcoin" href="https://gitcoin.co/grants/1624/cryptofeesinfo">
        Support us on Gitcoin
      </Button>

      <ToggleBar
        options={[
          { path: '/', label: 'L2 Transaction Fees' },
          { path: '/l1-fees', label: 'Total L1 Security Costs' },
        ]}
      />

      <L1List data={data} />

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
  const list = sdk.getCollection('rollup-l1-fees');
  await list.fetchAdapters();
  await list.fetchAdapterFromIPFS('QmXAS96EqCHc2JNS8yf7vvfcLdbBb9gmfeHLKLSrpUhEv5');

  const data = await list.executeQueryWithMetadata(
    'oneDayFeesPaidUSD',
    sdk.date.getYesterdayDate(),
    { allowMissingQuery: true }
  );

  return { props: { data }, revalidate: 15 * 60 };
};

export default Home;
