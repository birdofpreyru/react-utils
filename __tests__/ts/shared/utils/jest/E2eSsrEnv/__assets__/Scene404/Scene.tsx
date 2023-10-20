import { getSsrContext } from 'utils/globalState';

export default function Scene() {
  const context = getSsrContext(false);
  if (context) context.status = 404;
  return null;
}
