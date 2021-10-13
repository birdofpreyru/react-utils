import { isomorphy, webpack } from 'utils';

import ClientSide from './ClientSide';

export default isomorphy.IS_SERVER_SIDE
  ? webpack.requireWeak(`${__dirname}/ServerSide`) : ClientSide;
