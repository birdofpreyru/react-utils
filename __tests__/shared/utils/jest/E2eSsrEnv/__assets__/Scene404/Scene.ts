import type { FunctionComponent } from 'react';

import { useSsrContext } from 'utils/globalState';

const Scene: FunctionComponent = () => {
  const context = useSsrContext(false);

  // eslint-disable-next-line react-hooks/immutability
  if (context) context.status = 404;

  return null;
};

export default Scene;
