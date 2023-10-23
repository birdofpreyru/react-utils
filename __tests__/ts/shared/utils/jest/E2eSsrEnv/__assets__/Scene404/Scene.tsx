import { getSsrContext } from 'utils/globalState';

const Scene = () => {
  const context = getSsrContext(false);
  if (context) context.status = 404;
  return null;
};

export default Scene;
