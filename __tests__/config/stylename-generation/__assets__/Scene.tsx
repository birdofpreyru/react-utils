import type { FunctionComponent } from 'react';

/* eslint-disable import/no-relative-packages */
import A from './MockPackageA/TestComponent';
import B from './MockPackageB/TestComponent';

import styles from './style.scss';

const TestApp: FunctionComponent
  = () => <><A /><B />{JSON.stringify(styles)}</>;

export default TestApp;
