/**
 * Implements code splitting solution.
 */

import { isomorphy, webpack } from 'utils';

import ClientSide from './ClientSide';

export default isomorphy.isServerSide()
  ? webpack.requireWeak(`${__dirname}/ServerSide`) : ClientSide;
