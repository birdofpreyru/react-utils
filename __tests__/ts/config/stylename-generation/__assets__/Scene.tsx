// eslint-disable-next-line import/no-relative-packages
import A from './MockPackageA/TestComponent';
import styles from './style.scss';

const B = require('./MockPackageB/TestComponent').default;

const TestApp: React.FunctionComponent = () => (
  <><A /><B />{JSON.stringify(styles)}</>
);

export default TestApp;
