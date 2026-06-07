:::info[INFO]
For the purpose of `.IS_CLIENT_SIDE` and `.IS_SERVER_SIDE` constants the client-
and server-side are distinguished based on the presence in the environment of
the `process` object with Node version stored at its `process.versions.node`
path.

For the test purposes the library provides [JU].[mockClientSide()] and
[JU].[unmockClientSide()] functions, which enforce client side values of
these constants by removing / restoring `process.versions.node` value.

Alternatively, the client-side may be enforced by setting **true** the global
`REACT_UTILS_FORCE_CLIENT_SIDE` variable.
:::

[JU]: /docs/api/utils/jest-utils#mockclientside
[mockClientSide()]: /docs/api/utils/jest-utils#mockclientside
[unmockClientSide()]: /docs/api/utils/jest-utils#unmockclientside
