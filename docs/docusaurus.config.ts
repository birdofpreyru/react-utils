/* eslint-disable import/no-extraneous-dependencies */

import autoprefixer from 'autoprefixer';
import { themes as prismThemes } from 'prism-react-renderer';

import type * as Preset from '@docusaurus/preset-classic';
import type { Config, Plugin } from '@docusaurus/types';

import {
  getLocalIdent,
} from '@dr.pogodin/babel-plugin-react-css-modules/utils';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

global.REACT_UTILS_FORCE_CLIENT_SIDE = true;

const CODE_REPO = 'https://github.com/birdofpreyru/react-utils';
const EDIT_BASE = `${CODE_REPO}/edit/master/docs`;

const NPM_URL = 'https://www.npmjs.com/package/@dr.pogodin/react-utils';

const config: Config = {
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/docs/react-utils/',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'throw',
    },
  },
  onBrokenAnchors: 'throw',
  onBrokenLinks: 'throw',
  plugins: [(): Plugin => ({
    // NOTE: There is "docusaurus-plugin-sass" to handle SASS imports in
    // Docusaurus projects, but it is not set up to perform all necessary
    // code transformations for our react utils source code, thus we have
    // to configure SCSS loader from scratch.
    configureWebpack(_, isServer, { getStyleLoaders }) {
      const isProd = process.env.NODE_ENV === 'production';
      return {
        module: {
          rules: [{
            test: /\.scss$/,
            use: [
              ...getStyleLoaders(isServer, {
                importLoaders: 4,
                modules: {
                  exportOnlyLocals: isServer,
                  getLocalIdent,
                  localIdentName: '[hash:base64:6]',

                  // This flag defaults `true` for ES module builds since css-loader@7.0.0:
                  // https://github.com/webpack-contrib/css-loader/releases/tag/v7.0.0
                  // We'll keep it `false` to avoid a breaking change for dependant
                  // projects, and I am also not sure what are the benefits of
                  // named CSS exports anyway.
                  namedExport: false,
                },
                sourceMap: !isProd,
              }),
              {
                loader: 'postcss-loader',
                options: {
                  postcssOptions: {
                    plugins: [autoprefixer],
                  },
                },
              },
              'resolve-url-loader',
              {
                loader: 'sass-loader',
                options: {
                  sourceMap: true,
                },
              },
            ],
          }],
        },
        resolve: {
          fallback: { module: false },
        },
      };
    },
    name: 'build-customization',
  })],
  presets: [
    [
      'classic',
      {
        docs: {
          editUrl: EDIT_BASE,
          sidebarPath: './sidebars.ts',
        },
        theme: {
          customCss: './src/css/custom.scss',
        },
      } satisfies Preset.Options,
    ],
  ],
  tagline: 'ReactJS development kit.',
  themeConfig: {
    // TODO: Configure it later.
    // Replace with your project's social card
    // image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    footer: {
      copyright: `Copyright © 2019&ndash;${new Date().getFullYear()}, Dr. Sergey Pogodin`,
      links: [
        {
          items: [
            { label: 'API', to: '/docs/api' },
            { label: 'Getting Started', to: '/docs/tutorials' },
          ],
          title: 'Docs',
        },
        {
          items: [
            {
              href: CODE_REPO,
              label: 'GitHub',
            },
            {
              href: NPM_URL,
              label: 'NPM',
            },
          ],
          title: 'More',
        },
      ],
      style: 'dark',
    },
    navbar: {
      items: [
        {
          activeBaseRegex: '^/docs/react-utils/$',
          label: 'React Utils',
          to: '/',
        },
        {
          docId: 'tutorials/index',
          label: 'Getting Started',
          position: 'left',
          type: 'doc',
        },
        {
          docId: 'api/index',
          label: 'API',
          position: 'left',
          type: 'doc',
        },
        {
          href: CODE_REPO,
          label: 'GitHub',
          position: 'right',
        },
        {
          href: NPM_URL,
          label: 'NPM',
          position: 'right',
        },
      ],
      logo: {
        alt: 'Dr. Pogodin Studio',
        href: 'https://dr.pogodin.studio',
        src: 'img/logo-verbose.svg',
      },
    },
    prism: {
      darkTheme: prismThemes.dracula,
      theme: prismThemes.github,
    },
  } satisfies Preset.ThemeConfig,
  title: 'React Utils',

  // Set the production url of your site here
  url: 'https://dr.pogodin.studio',
};

export default config;
