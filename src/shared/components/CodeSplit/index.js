import { isomorphy, webpack } from 'utils';

import ClientSide from './ClientSide';

let Component; // eslint-disable-line import/no-mutable-exports

try {
  Component = isomorphy.IS_SERVER_SIDE
    && webpack.requireWeak(`${__dirname}/ServerSide`);
} catch (error) {
  Component = undefined;
}

if (!Component) Component = ClientSide;

export default Component;
