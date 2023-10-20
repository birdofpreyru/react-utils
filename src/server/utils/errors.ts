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

import joi from 'joi';

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

/**
 * @static
 * @const joi
 * @desc An alias for [Joi library](https://joi.dev/api/?v=17.4.0),
 * which provides tooling for HTTP request validation. You can use it in any
 * way you would use that library import.
 * @example
 * import { server } from '@dr.pogodin/react-utils';
 * const { joi } = server.errors;
 * const requestBodySchema = joi.object({
 *   sampleKey: joi.string().max(16).required(),
 * });
 */
export { joi };

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
export function newError(message: string, statusCode = CODES.INTERNAL_SERVER_ERROR) {
  const error = new ErrorWithStatus(message);
  error.status = statusCode;
  return error;
}

/**
 * ```js
 * import { server } from '@dr.pogodin/react-utils';
 * const { fail } = server.errors;
 * ```
 * Throws an error with given message and HTTP status code.
 * @param message Error message.
 * @param [statusCode=500] HTTP error code. Defaults to 500 (Internal
 * Server Error).
 */
export function fail(message: string, statusCode = CODES.INTERNAL_SERVER_ERROR) {
  throw newError(message, statusCode);
}

/**
 * ```js
 * import { server } from '@dr.pogodin/react-utils';
 * const { assert } = server.errors;
 * ```
 * Validates a value using given Joi schema, and throws an error with given
 * message and HTTP status code in case of the validation failure.
 * @param value
 * @param schema
 * @param [message] Error message.
 * @param [statusCode=500] HTTP status code. Defaults to 400 (Bad
 * Request).
 */
export function assert(
  value: any,
  schema: joi.AnySchema,
  message = '',
  statusCode = CODES.BAD_REQUEST,
) {
  const { error } = schema.validate(value, { abortEarly: false });
  if (error) {
    fail(message.concat(message ? '\n' : '', error.message), statusCode);
  }
}
