import EmptyPng from './empty.png';
import './style.scss';

const Scene: React.FunctionComponent = () => (
  <div styleName="container">
    {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
    <img alt="Empty PNG" src={EmptyPng} />
  </div>
);

export default Scene;
