# server
```jsx
import { server } from '@dr.pogodin/react-utils';
```
The [server](/docs/api/utils/server) module provides constants and methods
facilitating implementation, setup and launch of a configurable ReactJS web
server.

:::info
Beside holding attached constants and functions documented below, `server`
export itself is also a function, which creates and launches a web-server for
ReactJS application. See [server()] documentation for further details.
:::

**Constants**
- [errors.CODES](#errorscodes) - A map from HTTP status code names to
  the corresponding numeric codes.
- [errors.ERRORS](#errorserrors) - A map from HTTP status code names to
  their pretty-printed names.
- [SCRIPT_LOCATIONS] - The map of valid `location` values in [Script] objects.

**Functions**
- [errors.assert()](#errorsassert) - Validates a value against the given [Joi]
  schema.
- [errors.fail()](#errorsfail) - Throws an error with the given message and
  HTTP status code.
- [errors.getErrorForCode()](#errorsgeterrorforcode) - Given HTTP status code
  returns the corresponding error text.
- [errors.joi](#errorsjoi) - An alias for [Joi] library, which provides methods
  for HTTP request validation.
- [errors.newError()](#errorsnewerror) - Creates a new `Error` object with
  the given error message and attached HTTP status.
- [getDefaultCspSettings()](#getdefaultcspsettings) - Returns a deep copy of
  default [CSP] settings object used by **react-utils**.

## Constants

### errors.CODES
[errors.CODES]: #errorscodes
```tsx
import { server } from '@dr.pogodin/react-utils';

const { CODES } = server.errors;

enum CODES {
  // Same as StatusCodes from 'http-status-codes'.
}
```
Enum of HTTP status codes &mdash; an alias of  **StatusCodes** enum from
the [http-status-codes] library.

**Example**
```jsx
import { server } from '@dr.pogodin/react-utils';

const { CODES } = server.errors;
console.log(CODES.BAD_REQUEST);

// Prints: 400
```

### errors.ERRORS
```jsx
server.errors.ERRORS: object
```
A map from HTTP status code names to their pretty-printed names. It is an
alias for **ReasonPhrases** object from [http-status-codes] library.

**Example**
```jsx
import { server } from '@dr.pogodin/react-utils';

const { ERRORS } = server.errors;
console.log(ERRORS.BAD_REQUEST);

// Prints: Bad Request
```

### SCRIPT_LOCATIONS
```jsx
server.SCRIPT_LOCATIONS: object
```
This object provides the map of valid [Script]'s `location` values:
- `BODY_OPEN` - Right after the opening `<body>` tag.
- `DEFAULT` - In the end of `<body>` tag, just before the main application
  bundle. This is the default location where scripts are injected when provided
  as strings rather than [Script] objects.
- `HEAD_OPEN` - Right after the opening `<head>` tag.

## Functions

### errors.assert()
```jsx
server.errors.assert(value, schema, message = '', statusCode = 400)
```
Validates `value` against the given [Joi] `schema`. Throws an error with
the given error `message` and `statusCode` if the validation fails.

**Arguments**
- `value` - **any** value to validate.
- `schema` - **object** - [Joi] schema.
- `message = ''` - **string** - Optional. Error message. If given, the error
  message from [Joi] will be appended to it, otherwise the error message
  from [Joi] is used as is.
- `statusCode = 400` - **number** - Optional. Error status code. Defaults `400`
  (bad request).

### errors.fail()
```tsx
import { server } from '@dr.pogodin/react-utils';

const { fail } = server.errors;

function fail(
  message: string,
  statusCode: CODES = CODES.INTERNAL_SERVER_ERROR,
): never;
```
Throws an error with the given `message` and HTTP `statusCode`.

**Arguments**
- `message` &mdash; **string** &mdash; Error message.
- `statusCode` - [errors.CODES] - Optional. HTTP status code. Defaults `500`
  (internal server error).

It never **returns** normally.

### errors.getErrorForCode()
```jsx
server.errors.getErrorForCode(code): string
```
Given HTTP status `code` returns the corresponding error text. It is an alias
for **getReasonPhrase()** function from [http-status-codes] library.

**Arguments & Result**
- `code` - **number** - HTTP status code.
- Returns **string** - Error message.

### errors.joi
```jsx
server.errors.joi: object
```
An alias for [Joi] library, which provides methods useful for HTTP request
validation.

**Example**: [Joi] methods are used to create validation schema for the body of
a sample HTTP request.
```jsx
import { server } from '@dr.pogodin/react-utils';

const { joi } = server.errors;
const requestBodySchema = joi.object({
  sampleKey: joi.string().max(16).required(),
});
```

### errors.newError()
```jsx
server.errors.newError(message, statusCode = 500): Error
```
Creates a new `Error` object with given message, and HTTP `statusCode` attached
to the `result` as `result.status` field.

**Arguments & Result**
- `message` - **string** - Error message.
- `statusCode = 500` - **number** - Optional. HTTP status code. Defaults `500`
  (Internal Server Error).
- Returns **Error**.

### getDefaultCspSettings()
```jsx
server.getDefaultCspSettings(): object
```
Returns a deep copy of default [CSP] settings object used by **react-utils**,
with exception of `nonce-xxx` clause in `script-src` directive, which is added
dynamically for each request.

[CSP]: https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
[ExpressJS]: https://expressjs.com
[helmet]: https://github.com/helmetjs/helmet
[http-status-codes]: https://www.npmjs.com/package/http-status-codes
[Joi]: https://joi.dev/api/?v=17.4.2
[Script]: /docs/api/functions/server#beforerender-script
[server]: /docs/api/utils/server
[SCRIPT_LOCATIONS]: #script_locations
[server()]: /docs/api/functions/server
[Webpack]: https://webpack.js.org
