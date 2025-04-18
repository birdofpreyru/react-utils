import type { FunctionComponent } from 'react';
import { getSsrContext } from 'utils/globalState';

const Scene: FunctionComponent = () => {
  const context = getSsrContext(false);
  if (context) context.status = 404;
  return null;
};

export default Scene;
