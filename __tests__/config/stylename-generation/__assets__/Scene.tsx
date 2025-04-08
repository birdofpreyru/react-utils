import A from './MockPackageA/TestComponent';

import type * as BT from './MockPackageB/TestComponent';

import styles from './style.scss';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const B = (require('./MockPackageB/TestComponent') as typeof BT).default;

const TestApp: React.FunctionComponent
  = () => <><A /><B />{JSON.stringify(styles)}</>;

export default TestApp;
