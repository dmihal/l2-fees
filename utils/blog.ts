import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';

export interface BlogPost {
  slug: string;
  title: string;
  date: string | null;
  metadata: any;
}

export type Serialized = Awaited<ReturnType<typeof serialize>>;

export interface BlogPostWithSource extends BlogPost {
  contentSource: Serialized;
}

export async function getBlogPostList(): Promise<BlogPost[]> {
  const req = await fetch('https://api.github.com/repos/crypto-stats/blog/contents/l2fees');
  const blogList = await req.json();

  const entries = await Promise.all(
    blogList.map(
      async (file): Promise<BlogPost> => {
        const res = await fetch(file.download_url);
        const fileSource = await res.text();
        const {
          data: { title, date, ...metadata },
        } = matter(fileSource);

        return {
          slug: file.name.replace('.md', ''),
          title: title || file.name.replace('.md', ''),
          date: date ? date.toString() : null,
          metadata,
        };
      }
    )
  );

  return entries;
}

export async function getBlogPost(slug: string): Promise<BlogPostWithSource> {
  const req = await fetch('https://api.github.com/repos/crypto-stats/blog/contents/l2fees');
  const blogList = await req.json();

  for (const file of blogList) {
    if (file.name === `${slug}.md`) {
      const res = await fetch(file.download_url);
      const fileSource = await res.text();
      const {
        content,
        data: { title, date, ...metadata },
      } = matter(fileSource);
      const contentSource = await serialize(content);

      return {
        contentSource,
        slug: file.name.replace('.md', ''),
        title: title || file.name.replace('.md', ''),
        date: date ? date.toString() : null,
        metadata,
      };
    }
  }

  return null;
}
