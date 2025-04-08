import EmptyPng from './empty.png';
import './style.scss';

const Scene: React.FunctionComponent = () => (
  <div styleName="container">
    {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
    <img src={EmptyPng} alt="Empty PNG" />
  </div>
);

export default Scene;
