/** @jest-environment jsdom */

import { MemoryRouter } from 'react-router';

import NavLink from 'components/NavLink';

import { snapshot } from 'utils/jest';

import './styles.scss';

test('Matches snapshots', () => {
  snapshot(
    <MemoryRouter>
      <NavLink to="" />
    </MemoryRouter>,
  );
  snapshot(
    <MemoryRouter>
      <NavLink styleName="navLink" to="" />
    </MemoryRouter>,
  );
});
