import { getNodeTree, FileNode } from './utils/getNodeTree';
import { PropList, getPropList } from './propGenerator';
import { PathList, getPathList } from './pathGenerator';
import { SlugOption } from './common';

interface PostStore {
  postDir: string;
  rootNode: FileNode;
  propList: PropList;
  pathList: PathList;
}

interface getStoreProps {
  postDir: string;
  slugOption?: SlugOption;
  perPage?: number;
}

const defaultSlugs: SlugOption = {
  category: 'slug',
  tag: 'slug',
  post: 'slug',
  page: 'slug',
};

let store: PostStore;

export const getStore = async ({
  postDir,
  perPage = 10,
  slugOption = defaultSlugs,
}: getStoreProps): Promise<PostStore> => {
  if (store) return store;

  const filledSlugOption: SlugOption = { ...defaultSlugs, ...slugOption };

  const rootNode = await getNodeTree({
    nodePath: postDir,
  });

  const pathList = getPathList({
    perPage,
    slugOption: filledSlugOption,
    rootNode: rootNode,
  });

  const propList = getPropList({
    perPage,
    slugOption: filledSlugOption,
    pathList: pathList,
    rootNode: rootNode,
  });

  store = {
    postDir,
    rootNode,
    pathList,
    propList,
  };

  return store;
};
