import { PostData } from './postParser';
import { FileNode } from './utils/getNodeTree';
import { PathList, Path } from './pathGenerator';
import {
  getCategoriesAll,
  getPostsAll,
  getTagsAll,
  SlugOption,
  getPostsByCategories,
  getTotalPage,
  isPageSlug,
  trimPagePath,
  getPostsByPage,
  getPageNum,
  getPostsByTags,
  getPostBySlug,
} from './common';

export interface PageProp {
  count: number;
  totalPage: number;
  postList: PostData[];
}

export interface PostProp extends PostData {
  relatedPosts: PostData[];
}

export interface GlobalProp {
  postCount: number;
  categoryCount: number;
  tagCount: number;
}

interface PropMap<T> {
  [key: string]: T;
}

export interface PropList {
  global: GlobalProp;
  category: PropMap<PageProp>;
  page: PropMap<PageProp>;
  tag: PropMap<PageProp>;
  post: PropMap<PostProp>;
}

interface getPropListProps {
  rootNode: FileNode;
  pathList: PathList;
  slugOption: SlugOption;
  perPage?: number;
}

export const getPropList = (options: getPropListProps): PropList => {
  const { rootNode, pathList, slugOption, perPage = 10 } = options;
  const global: PropList['global'] = getGlobalProps(rootNode);
  const category: PropList['category'] = makePropList({
    rootNode,
    perPage,
    pathList: pathList.category,
    slugName: slugOption.category,
    getPostsFn: getPostsByCategories,
  });

  const tag: PropList['tag'] = makePropList({
    rootNode,
    perPage,
    pathList: pathList.tag,
    slugName: slugOption.tag,
    getPostsFn: getPostsByTags,
  });

  const page: PropList['page'] = makePropList({
    rootNode,
    perPage,
    pathList: pathList.page,
    slugName: slugOption.page,
    getPostsFn: getPostsAll,
  });

  const post = makePostPropList(rootNode, pathList.post, slugOption.post);

  return {
    global,
    category,
    page,
    tag,
    post,
  };
};

const getGlobalProps = (rootNode: FileNode): PropList['global'] => {
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
  getPostsFn: (rootNode: FileNode, slug?: string[]) => FileNode[];
  perPage?: number;
}

const makePropList = (options: getPropProps): PropMap<PageProp> => {
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

const makePostPropList = (
  rootNode: FileNode,
  pathList: Path[],
  slugName: string,
): PropList['post'] => {
  const postMap: PropList['post'] = {};

  for (const path of pathList) {
    const slug = path.params[slugName] as string;
    const post = getPostBySlug(rootNode, slug);
    const postData = post.postData;
    const categories = postData?.categories;
    let relatedPosts: PostData[] = [];

    if (categories?.length > 0) {
      relatedPosts = getPostsByCategories(rootNode, categories)
        .filter((node) => node.slug !== slug)
        .map((node) => node.postData);
    }

    postMap[slug] = { ...post.postData, relatedPosts };
  }

  return postMap;
};
