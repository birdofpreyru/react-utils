// Tests how response status is handled by the renderer and its cache.

import { getSsrContext } from '@dr.pogodin/react-global-state';
import factory from 'server/renderer';

import {
  mockHttpRequest,
  mockHttpResponse,
  mockWebpackConfig,
} from './__assets__/common';

const cacheController = jest.fn((req) => ({ key: req.url }));

let renderer;
let mockStatus;

beforeAll(() => {
  renderer = factory(mockWebpackConfig(), {
    Application: () => {
      const context = getSsrContext();
      context.status = mockStatus;
    },
    staticCacheController: cacheController,
  });
});

describe('status 200', () => {
  const req = mockHttpRequest({ url: '/200' });
  const { render, res } = mockHttpResponse();

  beforeEach(async () => {
    render.reset();
    mockStatus = 200;
    await renderer(req, res, console.error);
  });

  it('is reported by the intitial rendering', async () => {
    expect(render.status).toBe(200);
  });

  it('is reported by the cache response', async () => {
    expect(render.status).toBe(200);
  });
});

describe('status 404', () => {
  const req = mockHttpRequest({ url: '/404' });
  const { render, res } = mockHttpResponse();

  beforeEach(async () => {
    render.reset();
    mockStatus = 404;
    await renderer(req, res, console.error);
  });

  it('is reported by the intitial rendering', async () => {
    expect(render.status).toBe(404);
  });

  it('is reported by the cache response', async () => {
    expect(render.status).toBe(404);
  });
});

describe('status 500', () => {
  const req = mockHttpRequest({ url: '/500' });
  const { render, res } = mockHttpResponse();

  beforeEach(() => {
    render.reset();
  });

  it('is reported by the intitial rendering', async () => {
    mockStatus = 500;
    await renderer(req, res, console.error);
    expect(render.status).toBe(500);
  });

  it('is reported by the cache response', async () => {
    mockStatus = 200;
    await renderer(req, res, console.error);
    expect(render.status).toBe(200);
  });
});
