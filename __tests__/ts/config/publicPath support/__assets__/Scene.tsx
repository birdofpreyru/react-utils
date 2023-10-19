import EmptyPng from './empty.png';
import './style.scss';

export default function Scene() {
  return (
    <div styleName="container">
      <img src={EmptyPng} alt="Empty PNG" />
    </div>
  );
}
