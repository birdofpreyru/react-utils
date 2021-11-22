---
hide_title: true
sidebar_position: 0
slug: /api
title: Overview
---

## Components
- [Button](/docs/api/components/button) - Themed button / button-like link.
- [Checkbox](/docs/api/components/checkbox) - Themed checkbox.
- [CodeSplit](/docs/api/components/codesplit) - Defines a split (async-loaded)
  app segment.
- [Dropdown](/docs/api/components/dropdown) - Themed dropdown.
- [Input](/docs/api/components/input) - Themed text input.
- [Link](/docs/api/components/link) - External / internal hyperlink.
- [MetaTags](/docs/api/components/metatags) - Manages document's meta tags
  (title, description, social media thumbnails, _etc._).
- [Modal](/docs/api/components/modal) - Themed modal.
- [NavLink](/docs/api/components/navlink) - Navigation links (specially styled
  when match the current location).
- [PageLayout](/docs/api/components/pagelayout) - A simple themed page layout.
- [ScalableRect](/docs/api/components/scalablerect) - Container that keeps given
  aspect ratio while its width alters.
- [ThemeProvider](/docs/api/components/themeprovider) - Provides context visual
  themes to its children tree.
- [Throbber](/docs/api/components/throbber) - A simple throbber (three bouncing
  circles).
- [WithTooltip](/docs/api/components/withtooltip) - Themed tooltip wrapper.
- [YouTubeVideo](/docs/api/components/youtubevideo) - Embed YouTube video.

## Configs
- [Babel](/docs/api/configs/babel) - Configs (presets) for [Babel] builds.
- [ESLint](/docs/api/configs/eslint) - Configs for [ESlint] code scans.
- [Jest](/docs/api/configs/jest) - Configs for [Jest] test framework.
- [Stylelint](/docs/api/configs/stylelint) - Configs for [Stylelint] code scans.
- [Webpack](/docs/api/configs/webpack) - Configs for [Webpack] builds of apps
  and libs.

## Functions
- [client()](/docs/api/functions/client) - Client-side initialization and
  launch of ReactJS apps.
- [newBarrier()](/docs/api/functions/newbarrier) - Creates an async barrier
  object.
- [server()](/docs/api/functions/server) - Creates and starts ReactJS server.
- [withRetries()](/docs/api/functions/withretries) - Attempts an operation
  multiple times till the first success.

## Scripts
- [react-utils-build](/docs/api/scripts/react-utils-build) - Encapsulates [Babel]
  and [Webpack] compilation for apps and libs.
- [react-utils-setup](/docs/api/scripts/react-utils-setup) - Library setup and
  upgrades.

## Styles
- [Global SCSS Styles](/docs/api/styles/global) - Generic global CSS stylesheet
  for apps.
- [SCSS Mixins](/docs/api/styles/mixins) - Useful SCSS mixins.

## Utilities
- [api](/docs/api/utils/api) - An alias for [axios] library (HTTP(S) client).
- [config](/docs/api/utils/config) - Isomorphic app config.
- [isomorphy](/docs/api/utils/isomorphy) - Helpers for isomorphic code logic.
- [JU (Jest utils)](/docs/api/utils/jest-utils) - Helpers useful in [Jest] tests.
- [PT (prop-types)](/docs/api/utils/prop-types) - An alias for [prop-types] lib
  for runtime ReactJS prop type checks.
- [React Global State](/docs/api/utils/react-global-state) - Aliases for
  [react-global-state](https://dr.pogodin.studio/docs/react-global-state/index.html)
  lib.
- [server](/docs/api/utils/server) - Server-side constants and functions.
- [themed](/docs/api/utils/themed) - Aliases for
  [React Themes](https://dr.pogodin.studio/docs/react-themes) library.
- [time](/docs/api/utils/time) - Date & time utils.
- [webpack](/docs/api/utils/webpack) - [Webpack]-related utils.

[axios]: https://www.npmjs.com/package/axios
[Babel]: https://babeljs.io
[ESLint]: https://eslint.org
[Jest]: https://jestjs.io
[prop-types]: https://www.npmjs.com/package/prop-types
[Stylelint]: https://stylelint.io
[Webpack]: https://webpack.js.org
