import { createElement } from 'react';
import CodeSplit from 'components/CodeSplit';

/**
 * Wraps a regular React component into a "code splitting" component,
 * i.e. all code used exclusively by that component and its sub-tree
 * will go into a separate, asynchronously loaded, code chunk for
 * the client-side.
 * @param {object} options
 * @param {string} options.chunkName
 * @param {function} options.getClientSide
 * @param {React.ElementType} [options.placeholder]
 * @param {React.ElementType} [options.serverSide]
 * @returns {React.ElementType}
 */
export default function splitComponent({
  chunkName,
  getClientSide,
  placeholder,
  serverSide,
}) {
  // eslint-disable-next-line react/prop-types
  return ({ children = [], ...props } = {}) => createElement(
    CodeSplit,
    {
      ...props,
      chunkName,
      getClientSide,
      placeholder,
      serverSide,
    },
    ...children,
  );
}
