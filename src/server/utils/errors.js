// Assertion & error handling helpers.

import {
  StatusCodes as CODES,
  ReasonPhrases as ERRORS,
  getReasonPhrase as getErrorForCode,
} from 'http-status-codes';

import joi from 'joi';

/**
 * Auxiliary aliases.
 */
export {
  CODES,
  ERRORS,
  getErrorForCode,
  joi,
};

/**
 * Creates a new error with given message, and attached HTTP status code.
 * @param {string} message Error message.
 * @param {number} [statusCode=500] Optional. HTTP status code. Defaults to 500
 *  (Internal Server Error).
 * @return {Error}
 */
export function newError(message, statusCode = CODES.INTERNAL_SERVER_ERROR) {
  const error = new Error(message);
  error.status = statusCode;
  return error;
}

/**
 * Throws an error with given message and HTTP status code.
 * @param {string} message Error message.
 * @param {number} [statusCode=500] Optional. HTTP error code. Defaults to 500
 *  (Internal Server Error).
 * @throws {Error}
 */
export function fail(message, statusCode = CODES.INTERNAL_SERVER_ERROR) {
  throw newError(message, statusCode);
}

/**
 * Validates a value using the given Joi schema, and throws an error with
 * the given message and HTTP status code in case of the validation failure.
 * @param {any} value
 * @param {object} schema
 * @param {string} [message] Optional. Error message.
 * @param {number} [statusCode=500] Optional. HTTP status code. Defaults to 400
 *  (Bad Request).
 * @throws {Error}
 */
export function assert(
  value,
  schema,
  message = '',
  statusCode = CODES.BAD_REQUEST,
) {
  const { error } = schema.validate(value, { abortEarly: false });
  if (error) {
    fail(message.concat(message ? '\n' : '', error.message), statusCode);
  }
}
