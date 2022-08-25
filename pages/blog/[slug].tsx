import React from 'react';
import { NextPage, GetStaticProps, GetStaticPaths } from 'next';
import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote';
import { Tweet } from 'mdx-embed';
import dynamic from 'next/dynamic';
import SocialTags from 'components/SocialTags';
import { BlogPostWithSource, getBlogPost, getBlogPostList } from 'utils/blog';

interface BlogProps {
  post: BlogPostWithSource;
}

const components = {
  Tweet,
  LightXfer: dynamic(() => import('components/blog-widgets/LightXfer')),
};

export const Blog: NextPage<BlogProps> = ({ post }) => {
  return (
    <main>
      <SocialTags
        title={post.title}
        article={{
          publishedTime: new Date(post.date),
        }}
      />

      <div className="subtitle">L2Fees Blog</div>
      <div>
        <Link href="/blog">
          <a>Back</a>
        </Link>
      </div>
      <h1 className="title">{post.title}</h1>

      <MDXRemote components={components as any} {...post.contentSource} />

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

export const getStaticProps: GetStaticProps<BlogProps, { slug: string }> = async ({ params }) => {
  const post = await getBlogPost(params.slug);

  return { props: { post }, revalidate: 60 * 60 };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getBlogPostList();

  return {
    paths: posts.map((post) => ({ params: { slug: post.slug } })),
    fallback: 'blocking',
  };
};

export default Blog;
