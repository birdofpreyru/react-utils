/** @jest-environment jsdom */

import { MemoryRouter } from 'react-router';

import Link from 'components/Link';
import { snapshot } from 'utils/jest';

test('Matches snapshots', async () => {
  await snapshot(
    <MemoryRouter>
      <Link to="" />
    </MemoryRouter>,
  );
});
