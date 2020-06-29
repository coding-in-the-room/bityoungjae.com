import type { PostData } from './postParser';
import { findNode, findNodeAll } from './utils/visit';
import { getNodeTree, FileNode } from './getNodeTree';
import {
  convertToPath,
  findCategory,
  isCategory,
  isPost,
} from './utils/postStoreHelper';

interface Path {
  params: {
    [paramName: string]: string | string[];
  };
}

interface PostStoreProps {
  rootDir: string;
}

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

  /*
   * Path 리스트 관련 초기화 부
   */
  store.postPathList = store.posts.map(({ slug }) =>
    convertToPath('slug')(slug),
  );

  store.categoriesPathList = getCategoriesPaths(
    store.rootNode,
  ).map((categoryPath) => convertToPath('slug')(categoryPath));

  store.shouldUpdate = false;
  return store;
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
