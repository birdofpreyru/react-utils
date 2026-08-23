import type { FunctionComponent } from 'react';

import { useSsrContext } from 'utils/globalState';

const Scene: FunctionComponent = () => {
  const context = useSsrContext(false);
  if (context) context.setStatus(404);
  return null;
};

export default Scene;
