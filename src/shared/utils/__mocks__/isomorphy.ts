/**
 * Mockup of the isomorphy module.
 */
/* global jest */

// NOTE: I believe, there is no way to mock it without CommonJS syntax,
// or is there one now?
// eslint-disable-next-line import/no-import-module-exports
import type * as IsomorphyM from '../isomorphy';

const MOCK_BUILD_TIMESTAMP = 'Wed, 29 Nov 2017 07:40:00 GMT';

const mock = jest.requireActual<typeof IsomorphyM>('../isomorphy');

mock.buildTimestamp = () => MOCK_BUILD_TIMESTAMP;

// eslint-disable-next-line import/no-commonjs
module.exports = mock;
