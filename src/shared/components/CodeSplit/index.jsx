import { webpack } from 'utils';

import ClientSide from './ClientSide';

const Component = webpack.requireWeak('./ServerSide', __dirname) || ClientSide;

export default Component;

export function codeSplit({
  chunkName,
  getClientComponent,
  serverComponent,
  placeholder,
}) {
  // TODO: The code below, and inside <Component> implementations can be
  // somewhat optimized when we remove the old <CodeSplit> interface, but
  // for now this will do, and we keep the old <CodeSplit> for now as well.
  return (props) => (
    <Component
      chunkName={chunkName}
      getComponentAsync={getClientComponent}
      getComponentServer={() => serverComponent}
      placeholder={placeholder}
      {...props} // eslint-disable-line react/jsx-props-no-spreading
    />
  );
}
