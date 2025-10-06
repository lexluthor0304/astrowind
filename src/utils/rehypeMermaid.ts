import { visit } from 'unist-util-visit';
import type { Element, ElementContent, Properties } from 'hast';
import type { RehypePlugin } from '@astrojs/markdown-remark';

const hasMermaidClass = (className: Properties['className']): boolean => {
  if (!className) return false;

  const classes = Array.isArray(className) ? className : [className];

  return classes.some((value) =>
    typeof value === 'string' ? value.toLowerCase().includes('mermaid') : false
  );
};

const getCodeContent = (nodeChildren: ElementContent[]): string => {
  return nodeChildren
    .map((child) => (child.type === 'text' ? child.value : ''))
    .join('')
    .trim();
};

const mermaidRehypePlugin: RehypePlugin = () => {
  return function transformer(tree) {
    visit<Element>(tree, 'element', (node, index, parent) => {
      if (!parent || node.tagName !== 'code') {
        return;
      }

      if (!hasMermaidClass(node.properties?.className)) {
        return;
      }

      const chartDefinition = getCodeContent((node.children ?? []) as ElementContent[]);

      if (!chartDefinition) {
        return;
      }

      if (parent.type !== 'element') {
        return;
      }

      const container = parent as Element;

      container.tagName = 'div';
      const existingClassNames = (
        (Array.isArray(container.properties?.className)
          ? container.properties?.className
          : container.properties?.className
            ? [container.properties.className]
            : []) as (string | number)[]
      ).filter((item): item is string => typeof item === 'string');

      container.properties = {
        ...(container.properties || {}),
        className: Array.from(new Set([...existingClassNames, 'mermaid-container'])),
      };

      container.children = [
        {
          type: 'element',
          tagName: 'div',
          properties: {
            className: ['mermaid'],
          },
          children: [
            {
              type: 'text',
              value: chartDefinition,
            },
          ],
        },
      ];
    });
  };
};

export default mermaidRehypePlugin;
