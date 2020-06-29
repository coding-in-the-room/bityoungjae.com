import {
  getStore,
  getCategoriesPaths,
  getPostsByCategories,
  getPostBySlug,
} from '../lib/PostStore/postStore';
import isEqual from 'lodash.isequal';
import { testPath } from './env';

test('getCategoriesPaths', async () => {
  const store = await getStore({ rootDir: testPath });
  const categories = getCategoriesPaths(store.rootNode);

  const target = [
    ['javascript'],
    ['javascript', '특별-시리즈'],
    ['react'],
    ['redux'],
  ];

  expect(isEqual(target, categories)).toBe(true);
});

test('getPostsByCategories', async () => {
  const store = await getStore({ rootDir: testPath });
  const posts = getPostsByCategories(store.rootNode, [
    'javascript',
    '특별-시리즈',
  ]);

  expect(posts[0].slug).toBe('자바스크립트의-모든-것-1탄');
});

test('getPostsBySlug', async () => {
  const store = await getStore({ rootDir: testPath });
  const post = getPostBySlug(store.rootNode, '자바스크립트의-모든-것-1탄');

  expect(post?.postData?.title).toBe('자바스크립트의 모든 거엇!');
});
