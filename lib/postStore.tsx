import type { PostData } from './postParser';
import { findNode, findNodeAll, visit } from './visit';
import { getNodeTree, FileNode } from './getNodeTree';

interface Path {
  params: {
    [paramName: string]: string | string[];
  };
}

interface PostStoreProps {
  rootDir: string;
}

const convertToPath = (paramName: string) => (slug: string | string[]) => ({
  params: {
    [paramName]: slug,
  },
});

interface PostStore {
  rootDir: string;
  rootNode: FileNode;
  postNodes: FileNode[];
  posts: PostData[];
  postPathList: Path[];
  categoriesPathList: Path[];
  shouldUpdate: boolean;
}

const store: Partial<PostStore> = {
  shouldUpdate: true,
  postNodes: [],
};

export const getStore = async (options: PostStoreProps) => {
  if (!store.shouldUpdate) return store;

  const { rootDir } = options;
  store.rootDir = rootDir;

  store.rootNode = await getNodeTree({
    nodePath: rootDir,
    postStore: store.postNodes,
  });

  store.posts = store.postNodes.map((node) => node.postData);

  store.postPathList = store.posts.map(({ slug }) =>
    convertToPath('slug')(slug),
  );

  store.categoriesPathList = getCategoriesPaths(
    store.rootNode,
  ).map((categoryPath) => convertToPath('slug')(categoryPath));

  store.shouldUpdate = false;

  return store;
};

const isCategory = (node: FileNode) => node.type === 'category';
const isPost = (node: FileNode) => node.type === 'post';

export const getCategoryBySlug = (slug: string) => {
  return findNode(
    store.rootNode,
    (node) => isCategory(node) && node.slug === slug,
  );
};

export const getPostBySlug = (rootNode: FileNode, slug: string): FileNode => {
  return findNode(rootNode, (node) => node.slug === slug);
};

export const getPostsByCategories = (
  rootNode: FileNode,
  categories: string[],
) => {
  const categoryNode = findCategory(rootNode, categories);
  const posts = findNodeAll(categoryNode, isPost);

  return posts;
};

const findCategory = (rootNode: FileNode, categories: string[]) => {
  let now: FileNode = rootNode;

  for (const category of categories) {
    now = findNode(now, (node) => isCategory(node) && node.slug === category);
  }

  return now;
};

// 디렉터리 계층구조 중 next.js에 사용될 카테고리 path만 추출.
export const getCategoriesPaths = (
  rootNode: FileNode,
  parents: string[] = [],
) => {
  const result: string[][] = [];

  if (parents.length) result.push(parents);

  for (const node of rootNode.children) {
    if (isCategory(node)) {
      const category = [...parents, node.slug];
      result.push(...getCategoriesPaths(node, category));
    }
  }

  return result;
};
