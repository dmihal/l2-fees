import React, { useState } from 'react';
import { NextPage, GetStaticProps } from 'next';
import sdk from 'data/sdk';
import List from 'components/List';
import SocialTags from 'components/SocialTags';
import ToggleBar from 'components/ToggleBar';
import Link from 'next/link';

interface HomeProps {
  data: any[];
}

export const Home: NextPage<HomeProps> = ({ data }) => {
  const [mode, setMode] = useState('l2s');

  let _data = mode === 'rollups' ? data.filter((item) => item.id !== 'metisnetwork') : data;
  _data = _data.map((item) => (item.id === 'metisnetwork' ? { ...item, offchainDA: true } : item));

  return (
    <main>
      <SocialTags />

      <h1 className="title">L2 Fees</h1>

      <p className="description">
        Ethereum Layer-1 is expensive.
        <br />
        How much does it cost to use Layer-2?
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

      <div className="blog">
        How can rollups reduce their fees?
        <br />
        Read our first blog-post &ldquo;
        <Link href="/blog/rollup-calldata-compression">
          <a>Crunching the Calldata</a>
        </Link>
        &rdquo;.
      </div>

      <div className="l2beat">
        Want to better understand Ethereum&apos;s layer-2 ecosystem?
        <br />
        Visit our friends at <a href="https://l2beat.com">L2Beat.com</a> to learn more {}
        about scaling solutions and their risk assumptions.
      </div>

      <style jsx>{`
        main {
          padding: 2rem 0 0.25rem;
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

        .toolbar {
          max-width: 600px;
          width: 100%;
          display: flex;
          justify-content: flex-end;
        }

        .blog {
          text-align: center;
          margin-bottom: 14px;
          font-style: italic;
        }

        .l2beat {
          max-width: 600px;
          margin: 4px 8px;
          text-align: center;
        }
      `}</style>
    </main>
  );
};

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const collection = sdk.getCollection('l2-fees');
  const l1Adapters = sdk.getCollection('l1-fees');

  // This if statement shouldn't be necessary, but for some reason, Next calls getStaticProps twice :(
  // Spent way too long debugging that, so I'll just add this if statement for now
  if (!collection.getAdapter('ethereum')) {
    await collection.fetchAdapters();
    await l1Adapters.fetchAdapters();

    const ethAdapter = l1Adapters.getAdapter('ethereum');
    collection.addAdapter(ethAdapter);
  }

  const data = await collection.executeQueriesWithMetadata(
    ['feeTransferEth', 'feeTransferERC20', 'feeTransferToken', 'feeSwap'],
    { allowMissingQuery: true }
  );

  return { props: { data }, revalidate: 5 * 60 };
};

export default Home;
