# Server-side utilities

:::caution
Prior to the library [v1.47.0-alpha.8] all these utilities were exported as
fields and methods of the `server` function, exported from the main library
export; starting with [v1.47.0-alpha.8] they are moved to separate exports
from the dedicated server-side package export `@dr.pogodin/react-utils/server`.
:::

**Constants**
- [CODES](#codes) &mdash; A map from HTTP status code names to
  the corresponding numeric codes.
- [ERRORS](#errors) &mdash; A map from HTTP status code names to
  their pretty-printed names.
- [SCRIPT_LOCATIONS] &mdash; The map of valid `location` values in [Script] objects.

**Functions**
- [assert()](#assert) &mdash; Validates a value against the given
  validation schema compliant to the [Standard Schema Specs], _e.g._ [Zod]
  (recommended), or [Joi], _etc._
- [fail()](#fail) &mdash; Throws an error with the given message and
  HTTP status code.
- [getErrorForCode()](#geterrorforcode) &mdash; Given HTTP status code
  returns the corresponding error text.

- [launchServer()] &mdash; Creates and launches a web-server for ReactJS application.

- [newError()](#newerror) &mdash; Creates a new `Error` object with
  the given error message and attached HTTP status.
- [getDefaultCspSettings()](#getdefaultcspsettings) &mdash; Returns a deep copy of
  default [CSP] settings object used by **react-utils**.

- [registerBabelLoader()] &mdash; Registers a [Node module API hook] that
  customizes ES module loading to run Babel transformation on them (essentially,
  it is a functioning replacement for [@babel/node] and [@babel/register]).

- [registerResolver()] &mdash; Registers a [Node module API hook] that customizes
  ES module resolution to make mandatory file extensions optional.

:::caution[Deprecated]
- [errors.joi](#errorsjoi) &mdash; Removed in **v1.44.0**; an alias for [Joi]
  library, which provides methods for HTTP request validation.
:::

## Constants

### CODES
[CODES]: #codes
```tsx
import { CODES } from '@dr.pogodin/react-utils/server';

enum CODES {
  // Same as StatusCodes from 'http-status-codes'.
}
```
Enum of HTTP status codes &mdash; an alias of  **StatusCodes** enum from
the [http-status-codes] library.

**Example**
```tsx
import { CODES } from '@dr.pogodin/react-utils/server';

console.log(CODES.BAD_REQUEST);

// Prints: 400
```

### ERRORS
```tsx
import { ERRORS } from '@dr.pogodin/react-utils/server';

ERRORS: object
```
A map from HTTP status code names to their pretty-printed names. It is an
alias for **ReasonPhrases** object from [http-status-codes] library.

**Example**
```tsx
import { ERRORS } from '@dr.pogodin/react-utils/server';

console.log(ERRORS.BAD_REQUEST);

// Prints: Bad Request
```

### SCRIPT_LOCATIONS
```tsx
import { SCRIPT_LOCATIONS } from '@dr.pogodin/react-utils/server';

SCRIPT_LOCATIONS: object
```
This object provides the map of valid [Script]'s `location` values:
- `BODY_OPEN` - Right after the opening `<body>` tag.
- `DEFAULT` - In the end of `<body>` tag, just before the main application
  bundle. This is the default location where scripts are injected when provided
  as strings rather than [Script] objects.
- `HEAD_OPEN` - Right after the opening `<head>` tag.

## Functions

### assert()
```tsx
import { assert, CODES } from '@dr.pogodin/react-utils/server';

async function assert<T extends StandardSchemaV1>(
  value: unknown,
  schema: T,
  message = '',
  statusCode = CODES.BAD_REQUEST, // 400
): Promise<StandardSchemaV1.InferOutput<T>>;
```
Validates the `value` against the given validation schema, compliant to the
[Standard Schema Specs], _e.g._ [Zod] (recommended), or [Joi], _etc._. Throws
an error with the given error `message` and `statusCode` if the validation fails,
otherwise resolves to the validated value.

**Arguments**
- `value` &mdash; **unknown** &mdash; The value to validate.
- `schema` &mdash; **StandardSchemaV1** &mdash; The validation schema, compliant
  to the [Standard Schema Specs].
- `message = ''` &mdash; **string** &mdash; Optional. Error message. If given,
  the error message from the validator will be appended to it, otherwise the
  error message from the validator is used as is.
- `statusCode = 400` &mdash; **number** &mdash; Optional. Error status code.
  Defaults `400` (bad request).

**Resolves** the validated value, with correctly inferred type.

### fail()
```tsx
import { CODES, fail } from '@dr.pogodin/react-utils/server';

function fail(
  message: string,
  statusCode: CODES = CODES.INTERNAL_SERVER_ERROR,
): Error;
```
Throws an error with the given `message` and HTTP `statusCode`.

**Arguments**
- `message` &mdash; **string** &mdash; Error message.
- `statusCode` &mdash; [CODES] &mdash; Optional. HTTP status code. Defaults `500`
  (internal server error).

It never **returns**; however, its return type is declared as `Error` to allow
`throw fail(..)`, thus allowing the following TypeScript code:
```tsx
const value: number | undefined = someFunction();
if (value === undefined) throw fail('Some error');

// TypeScript allows this, because `throw fail()` above narrows down
// the `value` down to just `number`. 
const nextValue = value + 1;

// NOTE: According to TypeScript documentation it seems that `never` return
// type would be more appropriate for `fail()`; however, `never` return type
// does not result in the same value type narrowing in this example.
```

### getErrorForCode()
```tsx
import { getErrorForCode } from '@dr.pogodin/react-utils/server';

function getErrorForCode(code): string
```
Given HTTP status `code` returns the corresponding error text. It is an alias
for **getReasonPhrase()** function from [http-status-codes] library.

**Arguments & Result**
- `code` - **number** - HTTP status code.
- Returns **string** - Error message.

### newError()
```tsx
import { newError } from '@dr.pogodin/react-utils/server';

function newError(message, statusCode = 500): Error
```
Creates a new `Error` object with given message, and HTTP `statusCode` attached
to the `result` as `result.status` field.

**Arguments & Result**
- `message` - **string** - Error message.
- `statusCode = 500` - **number** - Optional. HTTP status code. Defaults `500`
  (Internal Server Error).
- Returns **Error**.

### getDefaultCspSettings()
```tsx
import { getDefaultCspSettings } from '@dr.pogodin/react-utils/server';

getDefaultCspSettings(): object
```
Returns a deep copy of default [CSP] settings object used by **react-utils**,
with exception of `nonce-xxx` clause in `script-src` directive, which is added
dynamically for each request.

### registerBabelLoader()
[registerBabelLoader()]: #registerbabelloader
```tsx
import { registerBabelLoader } from '@dr.pogodin/react-utils/server';

function registerBabelLoader(options: RegisterBabelLoaderArgT = {}): void

// where
type RegisterBabelLoaderArgT = {
  envName?: string;
  root?: string;
};
```

Registers a [Node module API hook](https://nodejs.org/docs/latest/api/module.html#customization-hooks)
that customizes ES module loading to run Babel transformation on `.js`, `.jsx`,
`.svg`, `.ts`, and `.tsx` modules, located outside `node_modules` and
`config/babel` folders. It is essentially the same feature provided by
[@babel/node], and [@babel/register], that do not work with imported ES modules
as of [Babel v8].

It is intended for development (test) environment purposes, as it does
the transformation &ldquo;on the fly&rdquo;, and caches transformation
results in memory.

:::caution[BEWARE]
It depends on ['@babel/core'], which is declared as development-only dependency
of this library.
:::

**Options**:
- `envName` &mdash; **string** &mdash; Babel environment. Defaults `development`.
- `root` &mdash; **string** &mdash; Babel root. Defaults the current working
  directory.

### registerResolver()
[registerResolver()]: #registerresolver
```tsx
import { registerResolver } from '@dr.pogodin/react-utils/server';

function registerResolver(): void;
```

Registers a [Node module API hook] that customizes ES module resolution
to make mandatory file extensions optional.

More specifically, it intercepts module resolution requests with `import`
condition, and [relative import specifiers] (those starting with `.` or `/`),
and attempts to resolve them by appending `.js`, `.jsx`, `.ts`, and `.tsx`
extensions; and if the given specifier points to a directory, it attempts
to resolve it by appending `/index.js`, `/index.jsx`, `/index.ts`,
and `/index.tsx`.

### errors.joi
:::danger[Deprecated]
Removed in **v1.44.0**. The original documentation below is kept for reference.

---

```tsx
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
:::

['@babel/core']: https://babeljs.io/docs/babel-core
[@babel/node]: https://babeljs.io/docs/babel-node
[@babel/register]: https://babeljs.io/docs/babel-register
[Babel v8]: https://babeljs.io/blog/2026/06/16/8.0.0
[CSP]: https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
[ExpressJS]: https://expressjs.com
[helmet]: https://github.com/helmetjs/helmet
[http-status-codes]: https://www.npmjs.com/package/http-status-codes
[Joi]: https://joi.dev/api
[launchServer()]: /docs/api/functions/launchServer
[Node module API hook]: https://nodejs.org/docs/latest/api/module.html#customization-hooks
[relative import specifiers]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#module_specifier_resolution
[Script]: /docs/api/functions/server#beforerender-script
[SCRIPT_LOCATIONS]: #script_locations
[Standard Schema Specs]: https://standardschema.dev

[v1.47.0-alpha.8]: https://github.com/birdofpreyru/react-utils/releases/tag/v1.47.0-alpha.8

[Webpack]: https://webpack.js.org
[Zod]: https://zod.dev
