import { FileNode } from '../getNodeTree';
import { findNode } from './visit';

export const isCategory = (node: FileNode) => node.type === 'category';
export const isPost = (node: FileNode) => node.type === 'post';

export const convertToPath = (paramName: string) => (
  slug: string | string[],
) => ({
  params: {
    [paramName]: slug,
  },
});

export const findCategory = (rootNode: FileNode, categories: string[]) => {
  let now: FileNode = rootNode;

  for (const category of categories) {
    now = findNode(now, (node) => isCategory(node) && node.slug === category);
  }

  return now;
};
