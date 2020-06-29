import { FileNode } from './getNodeTree';
const hasChildren = (node: FileNode) => !!node?.children?.length;

export function* visit(
  rootNode: FileNode,
  fn: (node: FileNode) => any,
): Generator<[any, FileNode]> {
  yield [fn(rootNode), rootNode];

  if (hasChildren(rootNode)) {
    for (const node of rootNode.children) {
      yield* visit(node, fn);
    }
  }
}

export const findNode = (
  rootNode: FileNode,
  fn: (node: FileNode) => boolean,
) => {
  for (const [isTrue, node] of visit(rootNode, fn)) {
    if (isTrue) return node;
  }
};

export const findNodeAll = (
  rootNode: FileNode,
  fn: (node: FileNode) => boolean,
) => {
  const nodeList: FileNode[] = [];

  for (const [isTrue, node] of visit(rootNode, fn)) {
    if (isTrue) nodeList.push(node);
  }

  return nodeList;
};
