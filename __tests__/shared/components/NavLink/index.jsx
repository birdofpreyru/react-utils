import NavLink from 'components/NavLink';
import { shallowSnapshot } from 'utils/jest';

import './styles.scss';

test('Matches snapshots', () => {
  shallowSnapshot(<NavLink />);
  shallowSnapshot(<NavLink styleName="navLink" />);
});
