import { PostData } from './postParser';
import { FileNode } from './utils/getNodeTree';
import { PathList } from './pathParser';
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
  getPostsByTag,
} from './common';

interface PageMeta {
  count: number;
  totalPage: number;
  postList: PostData[];
}

interface MetaMap<T extends PageMeta> {
  [key: string]: T;
}

export interface StoreMeta {
  count: {
    post: number;
    category: number;
    tag: number;
  };
  category: MetaMap<PageMeta>;
  page: MetaMap<PageMeta>;
  tag: MetaMap<PageMeta>;
}

interface getMetaDataProps {
  rootNode: FileNode;
  pathList: PathList;
  slugList: PageSlug;
  perPage?: number;
}

export const getMetaData = (options: getMetaDataProps): StoreMeta => {
  const { rootNode, pathList, slugList, perPage = 10 } = options;
  const count: StoreMeta['count'] = getCountMeta(rootNode);
  const category: StoreMeta['category'] = getCategoryMeta(
    rootNode,
    pathList,
    slugList,
    perPage,
  );

  const page: StoreMeta['page'] = getPageMeta(
    rootNode,
    pathList,
    slugList,
    perPage,
  );

  const tag: StoreMeta['tag'] = getTagMeta(
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

const getCountMeta = (rootNode: FileNode): StoreMeta['count'] => {
  const category = getCategoriesAll(rootNode).length;
  const post = getPostsAll(rootNode).length;
  const tag = getTagsAll(rootNode).length;

  return {
    category,
    post,
    tag,
  };
};

const getCategoryMeta = (
  rootNode: FileNode,
  pathList: PathList,
  slugList: PageSlug,
  perPage: number,
): StoreMeta['category'] => {
  const metaMap: StoreMeta['category'] = {};
  const categorySlug = slugList.category;

  for (const path of pathList.category) {
    const slug = path.params[categorySlug] as string[];
    const isPage = isPageSlug(slug);
    const categories = trimPagePath(slug);
    const posts = getPostsByCategories(rootNode, categories);
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

    const categoryMeta: PageMeta = {
      count,
      postList,
      totalPage,
    };

    metaMap[slug.join('/')] = categoryMeta;
  }

  return metaMap;
};

const getTagMeta = (
  rootNode: FileNode,
  pathList: PathList,
  slugList: PageSlug,
  perPage: number,
): StoreMeta['tag'] => {
  const metaMap: StoreMeta['tag'] = {};
  const tagSlug = slugList.tag;

  for (const path of pathList.category) {
    const slug = path.params[tagSlug] as string[];
    const isPage = isPageSlug(slug);
    const [tag] = trimPagePath(slug);
    const posts = getPostsByTag(rootNode, tag);
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

    const tagMeta: PageMeta = {
      count,
      postList,
      totalPage,
    };

    metaMap[slug.join('/')] = tagMeta;
  }

  return metaMap;
};

const getPageMeta = (
  rootNode: FileNode,
  pathList: PathList,
  slugList: PageSlug,
  perPage: number,
): StoreMeta['page'] => {
  const metaMap: StoreMeta['page'] = {};
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

    const pageMeta: PageMeta = {
      count,
      postList,
      totalPage,
    };

    metaMap[slug.join('/')] = pageMeta;
  }

  return metaMap;
};
