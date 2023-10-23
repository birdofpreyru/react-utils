import EmptyPng from './empty.png';
import './style.scss';

const Scene: React.FunctionComponent = () => (
  <div styleName="container">
    <img src={EmptyPng} alt="Empty PNG" />
  </div>
);

export default Scene;
