/** @jest-environment jsdom */

import { MemoryRouter } from 'react-router-dom';

import Link from 'components/Link';
import { snapshot } from 'utils/jest';

test('Matches snapshots', () => {
  snapshot(
    <MemoryRouter>
      <Link />
    </MemoryRouter>,
  );
});
