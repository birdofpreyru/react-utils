// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

/* eslint-disable import/no-extraneous-dependencies */

/* global global, module, require */

const autoprefixer = require('autoprefixer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const {
  getLocalIdent,
} = require('@dr.pogodin/babel-plugin-react-css-modules/utils');

// @ts-ignore
global.REACT_UTILS_FORCE_CLIENT_SIDE = true;

// TODO: Actually, double-check, if Docusaurus already supports ES modules for config?
// eslint-disable-next-line import/no-commonjs
const { themes } = require('prism-react-renderer');

const CODE_REPO = 'https://github.com/birdofpreyru/react-utils';
const EDIT_BASE = `${CODE_REPO}/edit/master/docs`;

const NPM_URL = 'https://www.npmjs.com/package/@dr.pogodin/react-utils';

const REACT_UTILS_STYLES = require.resolve('@dr.pogodin/react-utils/global-styles.scss');

/** @type {import('@docusaurus/types').Config} */
const config = {
  baseUrl: '/docs/react-utils/',
  favicon: 'img/favicon.ico',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'throw',
    },
  },
  onBrokenAnchors: 'throw',
  onBrokenLinks: 'throw',
  plugins: [() => ({
    // NOTE: There is "docusaurus-plugin-sass" to handle SASS imports in
    // Docusaurus projects, but it is not set up to perform all necessary
    // code transformations for our react utils source code, thus we have
    // to configure SCSS loader from scratch.
    configureWebpack: (cfg) => {
      /* eslint-disable no-param-reassign */
      cfg.resolve ??= {};
      cfg.resolve.fallback ??= {};

      // @ts-expect-error "Property 'module' does not exist on type '{ alias: string | false | string[]; name: string; onlyModule?: boolean | undefined; }[]'"
      cfg.resolve.fallback.module = false;

      cfg.module?.rules?.push({
        /* Loads SCSS stylesheets. */
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader, {
            loader: 'css-loader',
            options: {
              modules: {
                getLocalIdent,
                localIdentName: '[hash:base64:6]',

                // This flag defaults `true` for ES module builds since css-loader@7.0.0:
                // https://github.com/webpack-contrib/css-loader/releases/tag/v7.0.0
                // We'll keep it `false` to avoid a breaking change for dependant
                // projects, and I am also not sure what are the benefits of
                // named CSS exports anyway.
                namedExport: false,
              },
            },
          }, {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [autoprefixer],
              },
            },
          }, 'resolve-url-loader', {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      });

      // eslint-disable-next-line prefer-destructuring
      const babelRule = cfg.module.rules[5];

      if (!babelRule.use[0].loader.includes('babel-loader')) {
        throw Error('Internal error');
      }

      babelRule.exclude = [];

      cfg.node ??= {};

      // eslint-disable-next-line no-underscore-dangle
      cfg.node.__dirname = true;
      /* eslint-enable no-param-reassign */
    },
    name: 'sass',
  })],
  presets: [
    [
      '@docusaurus/preset-classic',

      /** @type {import('@docusaurus/preset-classic').Options} */
      {
        docs: {
          editUrl: EDIT_BASE,
          sidebarPath: require.resolve('./sidebars.js'),
        },
        theme: {
          customCss: [
            require.resolve(REACT_UTILS_STYLES),
            require.resolve('./src/css/custom.scss'),
          ],
        },
      },
    ],
  ],
  tagline: 'ReactJS development kit.',
  title: 'React Utils',

  themeConfig: /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    {
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
        darkTheme: themes.dracula,
        theme: themes.github,
      },
    },
  url: 'https://dr.pogodin.studio',
};

// eslint-disable-next-line import/no-commonjs
module.exports = config;
