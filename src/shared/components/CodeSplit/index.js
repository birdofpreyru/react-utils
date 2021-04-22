/**
 * @category Components
 * @func CodeSplit
 * @desc
 * ```js
 * import { CodeSplit } from '@dr.pogodin/react-utils';
 * ```
 * The `<CodeSplit>` component implements separation of an app part into
 * separate code & style chunks (thus, allowing to split compiled app bundle
 * into smaller lazy-loaded pieces).
 * @param {object} props Component properties.
 * @param {string} props.chunkName Unique chunk name.
 * @param {function} props.getComponentAsync Asynchronous function which
 * resolves to the component to render in place of the `<CodeSplit>`
 * (_i.e._ the component which we are splitting into a separate chunk),
 * and uses dynamic `import()` with Webpack's
 * [webpackChunkName](https://webpack.js.org/api/module-methods/#magic-comments) magic
 * comment stating the same chunk name, as was specified via the `chunkName`
 * property above.
 * @param {function} [props.getComponentServer] A synchronous version of
 * `getComponentAsync()` to be used during server-side rendering. If not
 * provided, the server-side code will fallback to the asynchronous
 * `getComponentAsync()`, which is sub-optimal. If provided, it should
 * use `webpack.requireWeak()` instead of regular `require()` to prevent
 * imported module to be statically bundled into primary chunks.
 * @param {function} [props.placeholder] Placeholder React component to render
 * while the code for actual splitted component is being loaded.
 * @param {...any} [props....] Any other properties are passed as is into
 * the splitted component.
 * @example
 * // Assume <SampleComponent> is a React sub-tree we want to split into
 * // a stand-alone chunk. To achieve it, we use <CodeSplit> to declare
 * // an auxiliary <WrappedSampleComponent>, which we'll use everywhere
 * // in the code instead of <SampleComponent>. In result <SampleComponent>,
 * // and any other components in its sub-tree, not required directly in
 * // other chunks, will be placed into a dedicated chunk.
 *
 * // WrappedSampleComponent.jsx
 * import { CodeSplit, webpack } from '@dr.pogodin/react-utils';
 *
 * export default function WrappedSampleComponent(props) {
 *   return (
 *     <CodeSplit
 *       chunkName="sample-component"
 *       getComponentAsync={
 *         // Note: Use the normal comment block opening and closing at
 *         // the next line instead of / * and * / (whitespaces between
 *         // start and slash had to be added due to limitations of our
 *         // documentation setup).
 *         () => import(/ * webpackChunkName: 'sample-component' * / 'path/to/SampleComponent')
 *       }
 *       getComponentServer={
 *         () => {
 *           // webpack.requireWeak() and webpack.resolveWeak() work
 *           // at server-side as the standard require() and
 *           // require.resolve(), but are ignored by Webpack,
 *           // and thus required and resolved modules are not
 *           // bundled into the client-side code.
 *           const path = webpack.requireWeak('path');
 *           const p = webpack.resolveWeak('path/to/SampleComponent');
 *           return webpack.requireWeap(path.resolve(__dirname, p));
 *         }
 *       }
 *       placeholder={() => <div>Optional Placeholder</div>}
 *       {...props}
 *     />
 *   );
 * }
 */

import { isomorphy, webpack } from 'utils';

import ClientSide from './ClientSide';

export default isomorphy.IS_SERVER_SIDE
  ? webpack.requireWeak(`${__dirname}/ServerSide`) : ClientSide;
