import { getSsrContext } from '@dr.pogodin/react-global-state';

export default function Scene() {
  const context = getSsrContext(false);
  if (context) context.status = 404;
}
