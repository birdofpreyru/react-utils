import mockdate from 'mockdate';

import type * as SrcM from '../src';

mockdate.set('2020-04-19Z');

// eslint-disable-next-line @typescript-eslint/no-require-imports
const lib = require('../src') as typeof SrcM;

test('Export at server side', () => {
  expect(lib).toMatchSnapshot();
  expect(Object.keys(lib.time)).toMatchSnapshot();

  // The order of these entries in "serverExports" below must be enforced,
  // to keep existing snapshots oder.
  const ORDER: Record<string, number> = {
    SCRIPT_LOCATIONS: 1,
    errors: 3,
    getDefaultCspSettings: 2,
  };

  const serverExports = Object.entries(lib.server!);
  serverExports.sort((a, b) => {
    const oA = ORDER[a[0]];
    const oB = ORDER[b[0]];
    // TODO: Actually, this comparison function should be moved to the top
    // level of the module, to avoid these lint rules triggering in the first
    // place.
    /* eslint-disable jest/no-conditional-in-test */
    if (oA && oB) return oA - oB;
    if (oA) return -1;
    if (oB) return 1;
    /* eslint-enable jest/no-conditional-in-test */
    return a[0].localeCompare(b[0]);
  });

  serverExports.forEach((item) => {
    expect(item).toMatchSnapshot();
  });
});
