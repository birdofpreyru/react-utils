/** @jest-environment jsdom */

import { MemoryRouter } from 'react-router';

import NavLink from 'components/NavLink';

import { snapshot } from 'utils/jest';

import './styles.scss';

test('Matches snapshots', async () => {
  await snapshot(
    <MemoryRouter>
      <NavLink to="" />
    </MemoryRouter>,
  );
  await snapshot(
    <MemoryRouter>
      <NavLink styleName="navLink" to="" />
    </MemoryRouter>,
  );
});
