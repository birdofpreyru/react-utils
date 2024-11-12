/** @jest-environment jsdom */

import { MemoryRouter } from 'react-router-dom';

import Link from 'components/Link';
import { snapshot } from 'utils/jest';

test('Matches snapshots', () => {
  snapshot(
    <MemoryRouter
      future={{
        v7_relativeSplatPath: true,
        v7_startTransition: true,
      }}
    >
      <Link to="" />
    </MemoryRouter>,
  );
});
