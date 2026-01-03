import getReadingTime from 'reading-time';
import { toString } from 'mdast-util-to-string';
import { visit } from 'unist-util-visit';
import type { RehypePlugin, RemarkPlugin } from '@astrojs/markdown-remark';
import { toText } from 'hast-util-to-text';

export const readingTimeRemarkPlugin: RemarkPlugin = () => {
  return function (tree, file) {
    const textOnPage = toString(tree);
    const readingTime = Math.ceil(getReadingTime(textOnPage).minutes);

    if (typeof file?.data?.astro?.frontmatter !== 'undefined') {
      file.data.astro.frontmatter.readingTime = readingTime;
    }
  };
};

const escapeHtml = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export const mermaidRemarkPlugin: RemarkPlugin = () => {
  return function (tree) {
    visit(tree, 'code', function (node, index, parent) {
      if (!parent || typeof index !== 'number') return;
      if (node.lang !== 'mermaid') return;

      const value = typeof node.value === 'string' ? node.value : '';
      const escaped = escapeHtml(value);

      parent.children[index] = {
        type: 'html',
        value: `<div class="mermaid">\n${escaped}\n</div>`,
      };
    });
  };
};

export const responsiveTablesRehypePlugin: RehypePlugin = () => {
  return function (tree) {
    if (!tree.children) return;

    for (let i = 0; i < tree.children.length; i++) {
      const child = tree.children[i];

      if (child.type === 'element' && child.tagName === 'table') {
        tree.children[i] = {
          type: 'element',
          tagName: 'div',
          properties: {
            style: 'overflow:auto',
          },
          children: [child],
        };

        i++;
      }
    }
  };
};

export const lazyImagesRehypePlugin: RehypePlugin = () => {
  return function (tree) {
    if (!tree.children) return;

    visit(tree, 'element', function (node) {
      if (node.tagName === 'img') {
        node.properties.loading = 'lazy';
      }
    });
  };
};

export const mermaidRehypePlugin: RehypePlugin = () => {
  return function (tree) {
    if (!tree.children) return;

    visit(tree, 'element', function (node, index, parent) {
      if (!parent || node.tagName !== 'pre' || typeof index !== 'number') return;

      const dataLanguage =
        typeof node.properties?.dataLanguage === 'string'
          ? node.properties.dataLanguage
          : typeof node.properties?.['data-language'] === 'string'
            ? node.properties['data-language']
            : undefined;

      let isMermaid = dataLanguage === 'mermaid';
      const code = node.children?.[0];
      if (!isMermaid && code && code.type === 'element' && code.tagName === 'code') {
        const className = code.properties?.className;
        const classes = Array.isArray(className)
          ? className
          : typeof className === 'string'
            ? className.split(' ')
            : [];
        isMermaid = classes.includes('language-mermaid');
      }
      if (!isMermaid) return;

      const textSource = code && code.type === 'element' ? code : node;
      const text = toText(textSource, { whitespace: 'pre' }).trim();

      parent.children.splice(index, 1, {
        type: 'element',
        tagName: 'div',
        properties: { className: ['mermaid'] },
        children: [{ type: 'text', value: text }],
      });
    });
  };
};
