import EmptyPng from './empty.png';
import './style.scss';

const Scene: React.FunctionComponent = () => (
  <div styleName="container">
    <img alt="Empty PNG" src={EmptyPng} />
  </div>
);

export default Scene;
