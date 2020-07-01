import { getStore, getStoreProps } from './store';
import { GlobalProp, PostListProp, PostProp, PropList } from './propGenerator';
import { Path, PathList } from './pathGenerator';

type PageCategory = keyof PropList & keyof PathList;

interface PageProp<
  T extends PostListProp | PostProp = PostListProp | PostProp
> {
  global: GlobalProp;
  main: T;
}

export type PostPageProp = PageProp<PostProp>;
export type PostListPageProp = PageProp<PostListProp>;

const makePageHandler = (pageCategory: PageCategory) => ({
  postDir,
  slugOption,
  perPage = 10,
}: getStoreProps) => {
  async function getPathsBySlug(): Promise<Path[]> {
    const store = await getStore({
      postDir,
      slugOption,
      perPage,
    });

    const pathList = store.pathList[pageCategory];
    return pathList;
  }

  async function getPropsBySlug(slug: string | string[]): Promise<PageProp> {
    const store = await getStore({
      postDir,
      slugOption,
      perPage,
    });

    const propList = store.propList[pageCategory];
    const key = Array.isArray(slug) ? slug.join('/') : slug;

    return {
      global: store.propList.global,
      main: propList[key],
    };
  }

  async function getMainPostListProps(): Promise<PageProp> {
    const store = await getStore({
      postDir,
      slugOption,
      perPage,
    });

    const propList = store.propList.page;
    return {
      global: store.propList.global,
      main: propList['page/1'],
    };
  }

  return {
    getPathsBySlug,
    getPropsBySlug,
    getMainPostListProps,
  };
};

export const getCategoryPageHandler = makePageHandler('category');
export const getPostPageHandler = makePageHandler('post');
export const getTagPageHandler = makePageHandler('tag');
export const getPageHandler = makePageHandler('page');
