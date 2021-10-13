```bash
./node_modules/.bin/react-utils-setup [options] [libraries...]
```
This NodeJS script facilitates library setup and upgrades. It helps to install
library depedencies into a host package, using the required versions, and also
saving them into the host's `package.json`.

This script installs each library from the whitespace separated list
`[libraries...]`. After installing each library, it also installs into the
host package:
1.  All development dependencies of that library, with the versions taken from
    the library's `package.json`. Installed dependencies are also saved as dev
    dependencies of the host package.
2.  All production dependencies, commong between the library and the host
    package, using the versions from the library's `package.json`.
    The versions are also saved into the host's `package.json`.

If no `[libraries...]` are specified, the latest version of
`@dr.pogodin/react-utils` is installed by default.

With `--just-fix-deps` option no libraries are installed, but their currently
installed versions are checked, and their dependencies are installed into
the host package in the way described above.

In other words, the command
```bash
./node_modules/.bin/react-utils-setup
```
is equivalent to manually executing
```bash
npm install --save @dr.pogodin/react-utils@latest
npm install --save-dev dev-dep-1@version dev-dep-2@version ...
npm install --save prod-dep-1@version prod-dep-2@version ...
```
where the lists of dev and prod dependencies are formed in the way described
above.
