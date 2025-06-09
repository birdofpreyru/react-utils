import type { Request } from 'express';

import factory from 'server/renderer';

import { mockHttpRequest, mockHttpResponse, mockWebpackConfig } from './__assets__/common';

// This test passes if it does not crash entire Jest testing process.
// eslint-disable-next-line jest/expect-expect
test('Errors thrown during the render are handled', async () => {
  const renderer = factory(mockWebpackConfig(), {
    Application: () => {
      throw Error('Test error should not crash the test');
    },
  });
  const { res } = mockHttpResponse();
  await renderer(
    (mockHttpRequest() as unknown) as Request,
    res,
    () => undefined,
  );
});
