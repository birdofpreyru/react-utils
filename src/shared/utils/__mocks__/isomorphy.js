/**
 * Mockup of the isomorphy module.
 */
/* global jest */

const MOCK_BUILD_TIMESTAMP = 'Wed, 29 Nov 2017 07:40:00 GMT';

const mock = jest.requireActual('../isomorphy');

mock.buildTimestamp = () => MOCK_BUILD_TIMESTAMP;

module.exports = mock;
