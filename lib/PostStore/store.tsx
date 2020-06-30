import { getNodeTree, FileNode } from './utils/getNodeTree';
import { PropList, getMetaData } from './propGenerator';
import { PathList, getPathList } from './pathGenerator';
import { PageSlug } from './common';

interface NodeList {
  posts: FileNode[];
  categories: FileNode[];
}

interface PostStore {
  shouldUpdate: boolean;
  rootDir?: string;
  rootNode?: FileNode;
  propList?: PropList;
  pathList?: PathList;
  nodeList?: NodeList;
}

let store: PostStore = {
  shouldUpdate: true,
};

interface getStoreProps {
  rootDir: string;
  slugOption?: PageSlug;
  perPage?: number;
}

const defaultSlugs: PageSlug = {
  category: 'slug',
  tag: 'slug',
  post: 'slug',
  page: 'slug',
};

export const getStore = async (options: getStoreProps) => {
  if (!store.shouldUpdate) return store;

  const { rootDir, slugOption = defaultSlugs, perPage = 10 } = options;
  const slugList: PageSlug = { ...slugOption, ...defaultSlugs };

  store.rootDir = rootDir;
  store.rootNode = await getNodeTree({
    nodePath: rootDir,
  });

  store.pathList = getPathList(store.rootNode, slugList, perPage);
  store.propList = getMetaData({
    slugList,
    perPage,
    pathList: store.pathList,
    rootNode: store.rootNode,
  });

  store.shouldUpdate = false;
  return store;
};
