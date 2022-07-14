import React, { useState } from 'react';
import { NextPage, GetStaticProps } from 'next';
import sdk from 'data/sdk';
import SocialTags from 'components/SocialTags';
import ToggleNavBar from 'components/ToggleNavBar';
import L1List from 'components/L1List';
import L1Chart from 'components/L1Chart';
import { bundleItems } from 'utils';
import ToggleBar from 'components/ToggleBar';

interface HomeProps {
  timeData: any[];
  dataWithMetadata: any[];
  bundles: any;
  l2Percent: { date: string; percent: number }[];
}

export const Home: NextPage<HomeProps> = ({ timeData, dataWithMetadata, bundles, l2Percent }) => {
  const [chartTab, setChartTab] = useState('total');
  const bundledData = (dataWithMetadata = bundleItems(dataWithMetadata, bundles));

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

      <p className="description">How much are rollups paying for Ethereum&apos;s security?</p>

      <p className="heart">
        <a href="https://cryptofees.info">CryptoFees.info</a>
        {' + '}
        <a href="https://l2beat.com">L2Beat.com</a>
        {' = ❤️'}
      </p>

      <L1List data={bundledData} percent={l2Percent[l2Percent.length - 1].percent} />

      <div className="chart-container">
        <L1Chart
          data={chartTab === 'l1percent' ? l2Percent : timeData}
          percent={chartTab === 'percent'}
          formatPercent={chartTab !== 'total'}
        />
      </div>

      <div>
        <ToggleBar
          options={[
            { value: 'total', label: 'L2 Fees' },
            { value: 'percent', label: 'L2 Percentage' },
            { value: 'l1percent', label: 'Percent of total L1 fees' },
          ]}
          selected={chartTab}
          onChange={(newTab) => setChartTab(newTab)}
        />
      </div>

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

        .chart-container {
          width: 100%;
          max-width: 800px;
          margin: 10px 0;
        }
      `}</style>
    </main>
  );
};

const NUM_DAYS = 21;

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const collection = sdk.getCollection('rollup-l1-fees');
  await collection.fetchAdapters();

  const feesCollection = sdk.getCollection('fees');
  await feesCollection.fetchAdapters();
  const ethFeesAdapter = feesCollection.getAdapter('eth');

  const dates: string[] = [];
  const yesterday = sdk.date.getYesterdayDate();
  for (let i = 0; i <= NUM_DAYS; i += 1) {
    dates.push(sdk.date.offsetDaysFormatted(yesterday, i - NUM_DAYS));
  }

  let timeData = await Promise.all(
    dates.map(async (date: string) => ({
      date,
      result: await collection.executeQuery('oneDayFeesPaidUSD', date),
      total: await ethFeesAdapter.executeQuery('oneDayTotalFees', date),
    }))
  );

  const l2Percent = [];

  timeData = timeData.map((oneDay) => {
    let l2total = 0;

    const transformedData = oneDay.result.reduce((map: any, result) => {
      l2total += result.result || 0;

      const id = result.bundle || result.id;
      map[id] = (map[id] || 0) + (result.result || 0);
      return map;
    }, {});

    l2Percent.push({
      date: oneDay.date,
      percent: l2total / oneDay.total,
    });

    return {
      date: oneDay.date,
      ...transformedData,
    };
  });

  const _dataWithMetadata = await collection.executeQueryWithMetadata(
    'oneDayFeesPaidUSD',
    yesterday
  );
  const dataWithMetadata = _dataWithMetadata.filter((result) => result.result);

  const bundles: any = {};
  await Promise.all(
    collection.bundleIds.map(async (id) => {
      bundles[id] = await collection.getBundle(id);
    })
  );

  return { props: { timeData, l2Percent, dataWithMetadata, bundles }, revalidate: 15 * 60 };
};

export default Home;
