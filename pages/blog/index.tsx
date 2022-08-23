import React from 'react';
import { NextPage, GetStaticProps } from 'next';
import SocialTags from 'components/SocialTags';
import { BlogPost, getBlogPostList } from 'utils/blog';
import Link from 'next/link';

interface BlogProps {
  posts: BlogPost[];
}

export const Blog: NextPage<BlogProps> = ({ posts }) => {
  return (
    <main>
      <SocialTags />

      <h1 className="title">L2Fees Blog</h1>

      <ul>
        {posts.map((post) => (
          <li key={post.slug}>
            <Link href={`/blog/${post.slug}`}>
              <a>{post.title}</a>
            </Link>
          </li>
        ))}
      </ul>

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

export const getStaticProps: GetStaticProps<BlogProps> = async () => {
  const posts = await getBlogPostList();

  return { props: { posts }, revalidate: 60 * 60 };
};

export default Blog;
