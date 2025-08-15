/**
 * @category Utilities
 * @module server/errors
 * @desc
 * ```js
 * import { server } from '@dr.pogodin/react-utils';
 * const { errors } = server;
 * ```
 * Server-side helpers for error handling.
 */

import {
  StatusCodes as CODES,
  ReasonPhrases as ERRORS,
  getReasonPhrase as getErrorForCode,
} from 'http-status-codes';

import type { StandardSchemaV1 } from '@standard-schema/spec';

/**
 * @static
 * @const CODES
 * @desc An alias for
 * [StatusCodes object from **http-status-codes** library](https://www.npmjs.com/package/http-status-codes).
 * It is a map between HTTP status code names and corresponding numeric codes.
 * @example
 * import { server } from '@dr.pogodin/react-utils';
 * const { CODES } = server.errors;
 * console.log(CODES.BAD_REQUEST); // Prints: 400
 */
export { CODES };

/**
 * @static
 * @const ERRORS
 * @desc An alias for
 * [ReasonPhrases object from **http-status-codes** library](https://www.npmjs.com/package/http-status-codes).
 * It is a map between HTTP status code names and their pretty-printed forms.
 * @example
 * import { server } from '@dr.pogodin/react-utils';
 * const { ERRORS } = server.errors;
 * console.log(ERRORS.BAD_REQUEST); // Prints: Bad Request
 */
export { ERRORS };

/**
 * @static
 * @func getErrorForCode
 * @desc An alias for
 * [getReasonPhrase() function from **http-status-codes** library](https://www.npmjs.com/package/http-status-codes).
 * Given an HTTP code it returns the corresponding error text.
 * @param {number} code HTTP code.
 * @return {string} HTTP error text.
 * @example
 * import { server } from '@dr.pogodin/react-utils';
 * console.log(server.errors.getErrorForCode(400)); // Prints: Bad Request
 */
export { getErrorForCode };

// TODO: It could accept the status code as a constructor argument.
class ErrorWithStatus extends Error {
  status: number = CODES.INTERNAL_SERVER_ERROR;
}

/**
 * ```js
 * import { server } from '@dr.pogodin/react-utils';
 * const { newError } = server.errors;
 * ```
 * Creates a new `Error` object with given message, and HTTP status code
 * attached as `status` field.
 * @param {string} message Error message.
 * @param {number} [statusCode=500] HTTP status code. Defaults to 500 (Internal
 * Server Error).
 * @return {Error}
 */
export function newError(
  message: string,
  statusCode = CODES.INTERNAL_SERVER_ERROR,
): ErrorWithStatus {
  const error = new ErrorWithStatus(message);
  error.status = statusCode;
  return error;
}

/**
 * Throws an error with given message and HTTP status code.
 */
export function fail(
  message: string,
  statusCode: CODES = CODES.INTERNAL_SERVER_ERROR,
): Error {
  throw newError(message, statusCode);
}

/**
 * Validates the `value` against the given "standard" validation `schema`.
 * Resolves to the correctly typed `value`, if it has passed the validation;
 * otherwise throws an error.
 * @param value The value to validate.
 * @param schema The "standard" validation schema to use.
 * @param [message] Optional error message, to prepend the validation error
 *  message.
 * @param [statusCode=400] HTTP status code. Defaults to 400 (Bad Request).
 */
export async function assert<T extends StandardSchemaV1>(
  value: unknown,
  schema: T,
  message = '',
  statusCode = CODES.BAD_REQUEST,
): Promise<StandardSchemaV1.InferOutput<T>> {
  let result = schema['~standard'].validate(value);
  if (result instanceof Promise) result = await result;

  if (result.issues) {
    let error = JSON.stringify(result.issues, null, 2);
    if (message) error = `${message}\n\n${error}`;
    throw fail(error, statusCode);
  }

  return result.value;
}
