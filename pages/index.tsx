import React, { useState, useEffect } from 'react';
import { NextPage, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import 'data/adapters';
import sdk from 'data/sdk';
import List from 'components/List';
import Button from 'components/Button';
import SocialTags from 'components/SocialTags';
import ToggleBar from 'components/ToggleBar';
import gtc from 'components/icons/gtc.svg';
import GasList from 'components/GasList';

interface HomeProps {
  data: any[];
  gasData: any[];
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

export const Home: NextPage<HomeProps> = ({ data, gasData }) => {
  const router = useRouter();
  const [type, setType] = useState('feeTransferEth');

  useEffect(() => {
    if (router.query.tab) {
      setType(router.query.tab.toString());
      router.replace(router.pathname);
    }
  }, [router.query]);

  return (
    <main>
      <SocialTags />

      <h1 className="title">L2 Fees</h1>

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

      <Button Icon={GTCIcon} target="gitcoin" href="https://gitcoin.co/grants/1624/cryptofeesinfo">
        Support us on Gitcoin
      </Button>

      <ToggleBar
        options={[
          { value: 'feeTransferEth', label: 'Transfer ETH' },
          { value: 'feeTransferERC20', label: 'Transfer tokens' },
          { value: 'feeSwap', label: 'Swap tokens' },
        ]}
        selected={type}
        onChange={setType}
      />

      <List data={data} query={type} />

      <p className="description" style={{ marginTop: '48px' }}>
        Rollups must pay Ethereum for security.
        <br />
        How much are they spending?
      </p>

      <GasList data={gasData} />

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
  const list = sdk.getList('fees');
  const data = await list.executeQueriesWithMetadata(
    ['feeTransferEth', 'feeTransferERC20', 'feeSwap'],
    { allowMissingQuery: true }
  );

  const gasList = sdk.getList('feeSpenders');
  const date = sdk.date.offsetDaysFormatted(sdk.date.formatDate(new Date()), -1);

  const gasData = await gasList.executeQueriesWithMetadata(
    ['oneDayGasFeesPaidETH', 'oneDayGasFeesPaidUSD'],
    date,
    { allowMissingQuery: true }
  );

  return { props: { data, gasData }, revalidate: 5 * 60 };
};

export default Home;
