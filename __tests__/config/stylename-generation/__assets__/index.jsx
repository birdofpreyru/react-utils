import A from './MockPackageA/TestComponent';
import styles from './style.scss';

const B = require('./MockPackageB/TestComponent').default;

export default function TestApp() {
  return <><A /><B />{JSON.stringify(styles)}</>;
}
