import React from 'react';
import Head from 'next/head';

const SocialTags: React.FC = () => {
  return (
    <Head>
      <meta property="og:title" content="L2Fees.info" />
      <meta
        property="og:image"
        content={`https://${process.env.NEXT_PUBLIC_VERCEL_URL}/api/social/top.png`}
      />
      <meta
        property="og:description"
        content="Ethereum Layer-1 is expensive. How much does it cost to use Layer-2?"
      />

      <meta name="twitter:title" content="L2Fees.info" />
      <meta
        name="twitter:description"
        content="Ethereum Layer-1 is expensive. How much does it cost to use Layer-2?"
      />
      <meta
        name="twitter:image"
        content={`https://${
          process.env.NEXT_PUBLIC_VERCEL_URL
        }/api/social/top.png?${new Date().getDate()}`}
      />
      <meta name="twitter:card" content="summary_large_image" />
    </Head>
  );
};

export default SocialTags;
