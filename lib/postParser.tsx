import fs from 'fs';
import matter from 'gray-matter';
import unified from 'unified';
import remark from 'remark-parse';
import remark2rehype from 'remark-rehype';
import rehypeSlug from 'rehype-slug';
import rehypeHtml from 'rehype-stringify';
import rehypePrism from './rehype-prism';
import rehypeSanitize from 'rehype-sanitize';
import sanitizeSchema from './sanitizeSchema.json';

const fsPromise = fs.promises;

export interface PostData {
  slug: string;
  title: string;
  category: string;
  tags: string[];
  html: string;
  date: Date;
}

export const parsePost = async (filePath: string, slug: string) => {
  const rawText = await fsPromise.readFile(filePath);

  const {
    data: { title = '', date = new Date(), tags = [], category = '' },
    content = '',
  } = matter(rawText);

  const html = await markdownToHTML(content);

  const post: PostData = {
    slug,
    title,
    tags,
    category,
    date: new Date(date),
    html,
  };

  return post;
};

export const markdownToHTML = async (markdown: string) => {
  const parser = unified()
    .use(remark)
    .use(remark2rehype)
    .use(rehypeSanitize, sanitizeSchema)
    .use(rehypeSlug)
    .use(rehypePrism)
    .use(rehypeHtml, {
      collapseEmptyAttributes: true,
    });

  const parsedData = await parser.process(markdown);
  const html = parsedData.contents.toString();

  return html;
};
