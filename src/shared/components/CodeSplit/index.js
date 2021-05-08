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
 * `getComponentAsync()`, which is sub-optimal. If provided, it will be called
 * with a special {@link resolveRequire} function passed in as the only
 * argument, which should be used to correctly resolve & require necessary
 * modules, without Webpack being able to detect it and thus bundle them
 * into client-side code (also see the example below).
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
 *         // NOTE: Use the normal comment block opening and closing at
 *         // the next line instead of / * and * / (whitespaces between
 *         // start and slash had to be added due to limitations of our
 *         // documentation setup).
 *         () => import(/ * webpackChunkName: 'sample-component' * / 'path/to/SampleComponent')
 *       }
 *       getComponentServer={
 *         // NOTE: You cannot just use the standard require() here, as it would
 *         // cause Webpack to bundle in required module into the current chunk,
 *         // instead of the split one. Thus, this workaround.
 *         (resolveRequire) => resolveRequire(__dirname, 'path/to/SampleComponent');
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
