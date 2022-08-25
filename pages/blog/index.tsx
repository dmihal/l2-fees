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
      <SocialTags title="Blog - L2Fees.info" />

      <h1 className="title">L2Fees Blog</h1>
      <div className="nav-links">
        <Link href="/">
          <a>Home</a>
        </Link>
      </div>

      <ul className="posts">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link href={`/blog/${post.slug}`}>
              <a>
                <div className="link-title">{post.title}</div>
                <div className="link-tagline">{post.metadata.tagline}</div>
                <div className="link-date">
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
              </a>
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

        .posts {
          display: flex;
          padding: 0;
        }

        .posts li {
          list-style: none;
          margin: 8px;
        }

        .posts a {
          display: block;
          width: 400px;
          height: 200px;
          border: solid 1px black;
          border-radius: 4px;
          box-sizing: border-box;
          padding: 8px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          text-decoration: none;
        }

        .link-title {
          font-weight: bold;
          font-size: 18px;
        }
        .link-date {
          color: #555;
          font-size: 14px;
        }

        .nav-links,
        .nav-links a {
          font-size: 14px;
          color: #555;
        }
        .nav-links a:hover {
          color: #999;
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
