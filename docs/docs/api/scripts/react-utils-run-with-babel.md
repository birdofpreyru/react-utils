# react-utils-run-with-babel

This [NodeJS] script is a simple alternative to [@babel/node] that works with
ESM codebases.

As of the latest [Babel] v8, it looks that [@babel/node] does not quite work
with ESM codebase, because it is only hooks up to and transforms CJS requires,
not ESM imports. `react-utils-run-with-babel` relies on Node's &ldquo;[module
customization hooks]&rdquo; (release candidate API, as of Node v24) to run
provided JS/TS script with runtime Babel transformation of the source code.

## Usage

From a host package's codebase, call it as
```bash
./node_modules/.bin/react-utils-run-with-babel your-script.ts
```

It will with use default Babel configuration (found in the `babel.confg.js` of
the current working directory, or other file / elsewhere, accoding to the usual
Babel rules for config look-up) to transform the source code of `your-script.ts`
and its dependencies, and it will run that script. If `your-script.ts` path is
not absolute, it will be resolved relative to the current working directory.

[@babel/node]: https://babeljs.io/docs/babel-node
[module customization hooks]: https://nodejs.org/docs/latest-v24.x/api/module.html#customization-hooks
[Babel]: https://babeljs.io
[NodeJS]: https://nodejs.org
