import React from 'react';
import Head from 'next/head';

interface ArticleProps {
  publishedTime?: Date;
  modifiedTime?: Date;
  author?: string;
  section?: string;
  tag?: string[];
}

interface SocialTagProps {
  title?: string;
  description?: string;
  image?: string;
  article?: ArticleProps;
}

export default function SocialTags({
  title = 'L2Fees.info',
  description = 'Ethereum Layer-1 is expensive. How much does it cost to use Layer-2?',
  image,
  article,
}: SocialTagProps) {
  const _image = image || `/api/social/top.png?${new Date().getDate()}`;
  const fullImage = `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/${_image}`;

  return (
    <Head>
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />

      <meta property="og:locale" content="en_US" />
      <meta property="og:title" content={title} />
      <meta property="og:site_name" content="L2Fees" />
      <meta property="og:image" content={fullImage} />
      <meta property="og:description" content={description} />

      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />
      <meta name="twitter:card" content="summary_large_image" />

      {article && (
        <>
          {article.publishedTime && (
            <meta name="article:published_time" content={article.publishedTime.toISOString()} />
          )}
          {article.modifiedTime && (
            <meta name="article:modified_time" content={article.modifiedTime.toISOString()} />
          )}
          {article.author && <meta name="article:modified_time" content={article.author} />}
          {article.section && <meta name="article:section" content={article.section} />}
          {article.tag &&
            article.tag.map((tag) => <meta name="article:tag" content={tag} key={tag} />)}
        </>
      )}
    </Head>
  );
}
