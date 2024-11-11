/** @jest-environment jsdom */

import { MemoryRouter } from 'react-router-dom';

import NavLink from 'components/NavLink';

import { snapshot } from 'utils/jest';

import './styles.scss';

test('Matches snapshots', () => {
  snapshot(
    <MemoryRouter
      future={{
        v7_relativeSplatPath: true,
        v7_startTransition: true,
      }}
    >
      <NavLink to="" />
    </MemoryRouter>,
  );
  snapshot(
    <MemoryRouter
      future={{
        v7_relativeSplatPath: true,
        v7_startTransition: true,
      }}
    >
      <NavLink styleName="navLink" to="" />
    </MemoryRouter>,
  );
});
