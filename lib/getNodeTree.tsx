import fs from 'fs';
import path from 'path';

import { PostData, parsePost } from './postParser';
import { slugify } from '../lib/slugify';

const fsPromise = fs.promises;
const markdownRegex = new RegExp(/\.mdx?$/);

const isDirectory = (dirent: fs.Dirent) => dirent.isDirectory();
const isMarkdown = (dirent: fs.Dirent) =>
  dirent.isFile() && markdownRegex.test(dirent.name);

const removeMarkdownExtension = (name: string) =>
  name.replace(markdownRegex, '');

interface FileNode {
  type: 'category' | 'post';
  name: string;
  slug: string;
  path: string;
  postData?: PostData;
  children?: FileNode[];
}

export async function getNodeTree(
  nodePath: string,
  isFile = false,
): Promise<FileNode> {
  const nodeName = path.basename(nodePath);

  const newNode: FileNode = {
    type: isFile ? 'post' : 'category',
    name: nodeName,
    slug: isFile
      ? slugify(removeMarkdownExtension(nodeName))
      : slugify(nodeName),
    path: nodePath,
  };

  if (!isFile) {
    newNode.children = [];
  } else {
    newNode.postData = await parsePost(nodePath, newNode.slug);
  }

  if (isFile) return newNode;

  const nodeList = await fsPromise.readdir(nodePath, { withFileTypes: true });
  if (!nodeList.length) return newNode;

  for (const node of nodeList) {
    const newPath = `${nodePath}/${node.name}`;

    if (isDirectory(node)) {
      newNode.children.push(await getNodeTree(newPath));
    } else if (isMarkdown(node)) {
      newNode.children.push(await getNodeTree(newPath, true));
    }
  }

  return newNode;
}
