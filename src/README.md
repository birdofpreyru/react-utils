`@dr.pogodin/react-utils` is yet another ReactJS development kit. The starter
pack [`@dr.pogodin/react-starter`](https://github.com/birdofpreyru/react-starter)
provides the setup which takes full advantage of this library.

### Content
- Reference
  - [Utilities](#utilities)

### <a name="utilities"></a> Utilities
- {@link module:time time} &ndash; Date & time utilities: an alias of `dayjs`
  library, extended with some auxiliary constants and methods.
- {@link module:withRetries withRetries} &ndash; A helper which attempts
  to execute given async operation up to the specified number of times with
  given intervals between attempts. It stops and returns the operation result
  after the first successful attempt.
