import fs from 'fs';
import { getNodeTree } from '../lib/PostStore/utils/getNodeTree';
import snapshot from './testPosts.snapshot.json';
import isEqual from 'lodash.isequal';
import path from 'path';

const snapshotPath = path.resolve(
  process.cwd(),
  './tests/testPosts.snapshot.json',
);

test('getNodeTree', async () => {
  const rootDir = path.resolve(process.cwd(), './tests/testPosts');
  const postStore = [];
  const fileTree = await getNodeTree({
    nodePath: rootDir,
  });
  const stringifiedTree = JSON.stringify(fileTree, null, 2);
  const json = JSON.parse(stringifiedTree);

  await fs.promises.writeFile(snapshotPath, stringifiedTree);

  expect(isEqual(snapshot, json)).toBe(true);
});
