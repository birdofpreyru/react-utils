/**
 * Mockup of the isomorphy module.
 */
/* global jest */

import * as IsomorphyM from '../isomorphy';

const MOCK_BUILD_TIMESTAMP = 'Wed, 29 Nov 2017 07:40:00 GMT';

const mock = jest.requireActual<typeof IsomorphyM>('../isomorphy');

mock.buildTimestamp = () => MOCK_BUILD_TIMESTAMP;

module.exports = mock;
