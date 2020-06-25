import type { Node } from 'unist';
import visit from 'unist-util-visit';
import Prism from 'prismjs';

interface rehypeNode extends Node {
  tagName: string;
  properties: {
    className?: string[];
    [key: string]: string[];
  };
  children?: (Node & { value: string })[];
}

const langPrefix = 'language-';

const getLanguage = (node: rehypeNode) => {
  const className = node.properties && node.properties.className;
  if (!Array.isArray(className)) return '';

  const languageClass = className.find((name) => name.startsWith(langPrefix));
  const language = languageClass.substr(langPrefix.length);

  return language;
};

const getCode = (node: rehypeNode) => {
  if (!node.children || !node.children.length) return '';
  if (node.children[0].type !== 'text' || !node.children[0].value) return '';

  return node.children[0].value;
};

const setCode = (node: rehypeNode, code: string) => {
  if (!node.children || !node.children.length) return '';
  if (node.children[0].type !== 'text' || !node.children[0].value) return '';

  node.children[0].value = code;
};

const nodeEditor = (node: rehypeNode) => {
  if (node.tagName === 'code') {
    const language = getLanguage(node);
    const code = getCode(node);

    if (!language || !code) return;

    const highlightedCode = Prism.highlight(
      code,
      Prism.languages[language],
      language,
    );

    setCode(node, highlightedCode);
  }
};

export default () => {
  return (root) => {
    return visit(root, 'element', nodeEditor);
  };
};
