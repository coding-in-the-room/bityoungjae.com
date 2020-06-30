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

interface PageProp {
  count: number;
  totalPage: number;
  postList: PostData[];
}

interface PropMap<T extends PageProp> {
  [key: string]: T;
}

export interface PropList {
  count: {
    post: number;
    category: number;
    tag: number;
  };
  category: PropMap<PageProp>;
  page: PropMap<PageProp>;
  tag: PropMap<PageProp>;
}

interface getMetaDataProps {
  rootNode: FileNode;
  pathList: PathList;
  slugList: PageSlug;
  perPage?: number;
}

export const getMetaData = (options: getMetaDataProps): PropList => {
  const { rootNode, pathList, slugList, perPage = 10 } = options;
  const count: PropList['count'] = getCountMeta(rootNode);
  const category: PropList['category'] = getMeta({
    rootNode,
    perPage,
    pathList: pathList.category,
    slugName: slugList.category,
    getPostsFn: getPostsByCategories,
  });

  const tag: PropList['tag'] = getMeta({
    rootNode,
    perPage,
    pathList: pathList.tag,
    slugName: slugList.tag,
    getPostsFn: getPostsByTags,
  });

  const page: PropList['page'] = getPageMeta(
    rootNode,
    pathList,
    slugList,
    perPage,
  );

  return {
    count,
    category,
    page,
    tag,
  };
};

const getCountMeta = (rootNode: FileNode): PropList['count'] => {
  const category = getCategoriesAll(rootNode).length - 1;
  const post = getPostsAll(rootNode).length;
  const tag = getTagsAll(rootNode).length;

  return {
    category,
    post,
    tag,
  };
};

interface getMetaProps {
  rootNode: FileNode;
  pathList: Path[];
  slugName: string;
  getPostsFn: (rootNode: FileNode, slug: string[]) => FileNode[];
  perPage?: number;
}

const getMeta = (options: getMetaProps): PropMap<PageProp> => {
  const { rootNode, pathList, slugName, perPage, getPostsFn } = options;
  const metaMap: PropMap<PageProp> = {};

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

    const meta: PageProp = {
      count,
      postList,
      totalPage,
    };

    metaMap[slug.join('/')] = meta;
  }

  return metaMap;
};

const getPageMeta = (
  rootNode: FileNode,
  pathList: PathList,
  slugList: PageSlug,
  perPage: number,
): PropList['page'] => {
  const metaMap: PropList['page'] = {};
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

    const pageMeta: PageProp = {
      count,
      postList,
      totalPage,
    };

    metaMap[slug.join('/')] = pageMeta;
  }

  return metaMap;
};
