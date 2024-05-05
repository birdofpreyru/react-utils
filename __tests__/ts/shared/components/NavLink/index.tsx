/** @jest-environment jsdom */

import { MemoryRouter } from 'react-router-dom';

import NavLink from 'components/NavLink';

import { snapshot } from 'utils/jest';

import './styles.scss';

test('Matches snapshots', () => {
  snapshot(
    <MemoryRouter>
      <NavLink />
    </MemoryRouter>,
  );
  snapshot(
    <MemoryRouter>
      <NavLink styleName="navLink" />
    </MemoryRouter>,
  );
});
