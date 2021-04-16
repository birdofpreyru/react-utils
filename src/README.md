`@dr.pogodin/react-utils` is yet another ReactJS development kit. The starter
pack [`@dr.pogodin/react-starter`](https://github.com/birdofpreyru/react-starter)
provides the setup which takes full advantage of this library.

### Content
- [Reference](#reference)
  - [Configs](#configs)
  - [Utilities](#utilities)

## <a name="reference"></a> Reference

### <a name="configs"></a> Configs
- {@link module:babel/webpack babel/webpack} &ndash; Babel configuration for
  Webpack builds.

### <a name="utilities"></a> Utilities
- {@link module:api api} &ndash; An alias for `axios` (HTTP(S) client).
- {@link module:time time} &ndash; Date & time utilities: an alias for `dayjs`
  library, extended with some auxiliary constants and methods.
- {@link module:withRetries withRetries} &ndash; A helper which attempts
  to execute given async operation up to the specified number of times with
  given intervals between attempts. It stops and returns the operation result
  after the first successful attempt.
