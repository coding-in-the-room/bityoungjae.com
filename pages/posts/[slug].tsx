import React from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';

/* Server-side modules */
import fs from 'fs';
import { dir } from 'console';
const fsPromise = fs.promises;

const PostPage: React.FC = () => <div>Post 페이지에용</div>;

export default PostPage;

/*
Server-side Block 입니다
*/

const removeMarkdownExtension = ({ name: fileName }) =>
  fileName.replace(/.mdx?/, '');
const isDirectory = (dirent: fs.Dirent) => dirent.isDirectory();
const isMarkdown = (dirent: fs.Dirent) =>
  dirent.isFile() && dirent.name.endsWith('.md');
const convertToPath = (paramName: string) => (slug: string) => ({
  params: {
    [paramName]: slug,
  },
});

export const getStaticPaths: GetStaticPaths = async () => {
  const nodeList = await fsPromise.readdir('posts', { withFileTypes: true });
  const dirList = nodeList
    .filter(isDirectory)
    .map(({ name }) => name)
    .map(convertToPath('slug'));
  const markdownList = nodeList
    .filter(isMarkdown)
    .map(removeMarkdownExtension)
    .map(convertToPath('slug'));

  const paths = [...dirList, ...markdownList];

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  return {
    props: {},
  };
};
