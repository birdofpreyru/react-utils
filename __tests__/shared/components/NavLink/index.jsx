import NavLink from 'components/NavLink';
import React from 'react';
import { shallowSnapshot } from 'utils/jest';

import './styles.scss';

test('Matches snapshots', () => {
  shallowSnapshot(<NavLink />);
  shallowSnapshot(<NavLink styleName="navLink" />);
});
