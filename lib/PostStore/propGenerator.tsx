import { PostData } from './postParser';
import { FileNode } from './utils/getNodeTree';
import { PathList, Path } from './pathGenerator';
import {
  getCategoriesAll,
  getPostsAll,
  getTagsAll,
  PageSlug,
  getPostsByCategories,
  getTotalPage,
  isPageSlug,
  trimPagePath,
  getPostsByPage,
  getPageNum,
  getPostsByTags,
} from './common';

export interface PageProp {
  count: number;
  totalPage: number;
  postList: PostData[];
}

export interface GlobalProp {
  postCount: number;
  categoryCount: number;
  tagCount: number;
}

interface PropMap<T extends PageProp> {
  [key: string]: T;
}

export interface PropList {
  global: GlobalProp;
  category: PropMap<PageProp>;
  page: PropMap<PageProp>;
  tag: PropMap<PageProp>;
}

interface getPropDataProps {
  rootNode: FileNode;
  pathList: PathList;
  slugList: PageSlug;
  perPage?: number;
}

export const getPropData = (options: getPropDataProps): PropList => {
  const { rootNode, pathList, slugList, perPage = 10 } = options;
  const global: PropList['global'] = getCountProp(rootNode);
  const category: PropList['category'] = getProp({
    rootNode,
    perPage,
    pathList: pathList.category,
    slugName: slugList.category,
    getPostsFn: getPostsByCategories,
  });

  const tag: PropList['tag'] = getProp({
    rootNode,
    perPage,
    pathList: pathList.tag,
    slugName: slugList.tag,
    getPostsFn: getPostsByTags,
  });

  const page: PropList['page'] = getPageProp(
    rootNode,
    pathList,
    slugList,
    perPage,
  );

  return {
    global,
    category,
    page,
    tag,
  };
};

const getCountProp = (rootNode: FileNode): PropList['global'] => {
  const categoryCount = getCategoriesAll(rootNode).length - 1;
  const postCount = getPostsAll(rootNode).length;
  const tagCount = getTagsAll(rootNode).length;

  return {
    categoryCount,
    postCount,
    tagCount,
  };
};

interface getPropProps {
  rootNode: FileNode;
  pathList: Path[];
  slugName: string;
  getPostsFn: (rootNode: FileNode, slug: string[]) => FileNode[];
  perPage?: number;
}

const getProp = (options: getPropProps): PropMap<PageProp> => {
  const { rootNode, pathList, slugName, perPage, getPostsFn } = options;
  const propMap: PropMap<PageProp> = {};

  for (const path of pathList) {
    const slug = path.params[slugName] as string[];
    const isPage = isPageSlug(slug);
    const trimmedSlug = trimPagePath(slug);
    const posts = getPostsFn(rootNode, trimmedSlug);
    const totalPage = getTotalPage(posts.length, perPage);

    let count: number;
    let postList: PostData[];

    if (isPage) {
      const currentPage = getPageNum(slug);
      postList = getPostsByPage(posts, currentPage, perPage).map(
        (node) => node.postData,
      );
      count = postList.length;
    } else {
      count = posts.length;
      postList = posts.map((node) => node.postData);
    }

    const prop: PageProp = {
      count,
      postList,
      totalPage,
    };

    propMap[slug.join('/')] = prop;
  }

  return propMap;
};

const getPageProp = (
  rootNode: FileNode,
  pathList: PathList,
  slugList: PageSlug,
  perPage: number,
): PropList['page'] => {
  const propMap: PropList['page'] = {};
  const pageSlug = slugList.page;

  for (const path of pathList.page) {
    const slug = path.params[pageSlug] as string[];
    const posts = getPostsAll(rootNode);
    const currentPage = getPageNum(slug);
    const postList = getPostsByPage(posts, currentPage, perPage).map(
      (node) => node.postData,
    );
    const count = postList.length;
    const totalPage = getTotalPage(posts.length, perPage);

    const pageProp: PageProp = {
      count,
      postList,
      totalPage,
    };

    propMap[slug.join('/')] = pageProp;
  }

  return propMap;
};
