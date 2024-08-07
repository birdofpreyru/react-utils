import mockdate from 'mockdate';

mockdate.set('2020-04-19Z');

const lib = require('../src');

test('Export at server side', () => {
  expect(lib).toMatchSnapshot();
  expect({ ...lib._ }).toMatchSnapshot();
  expect(Object.keys(lib.time)).toMatchSnapshot();

  // The order of these entries in "serverExports" below must be enforced,
  // to keep existing snapshots oder.
  const ORDER: {
    [key: string]: number | undefined;
  } = {
    SCRIPT_LOCATIONS: 1,
    getDefaultCspSettings: 2,
    errors: 3,
  };

  const serverExports = Object.entries(lib.server);
  serverExports.sort((a, b) => {
    const oA = ORDER[a[0]];
    const oB = ORDER[b[0]];
    if (oA && oB) return oA - oB;
    if (oA) return -1;
    if (oB) return 1;
    return a[0].localeCompare(b[0]);
  });

  serverExports.forEach((item) => expect(item).toMatchSnapshot());
});
