import { getStore } from '../lib/PostStore/store';
import { getPostsByCategories, getPostBySlug } from '../lib/PostStore/common';
import isEqual from 'lodash.isequal';
import { testPath } from './env';
import { getCategoriesPaths } from '../lib/PostStore/pathParser';

test('getCategoriesPaths', async () => {
  const store = await getStore({ rootDir: testPath, perPage: 2 });
  const categories = getCategoriesPaths(store.rootNode);

  const target = [
    ['javascript'],
    ['javascript', 'page', '1'],
    ['javascript', '특별-시리즈'],
    ['javascript', '특별-시리즈', 'page', '1'],
    ['react'],
    ['react', 'page', '1'],
    ['react', '꿀팁-정리'],
    ['react', '꿀팁-정리', 'page', '1'],
    ['react', '리액트-핵심정리'],
    ['react', '리액트-핵심정리', 'page', '1'],
    ['redux'],
    ['redux', 'page', '1'],
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
