// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

/* global global, module, process, require */

// @ts-ignore
global.REACT_UTILS_FORCE_CLIENT_SIDE = true;

// TODO: Actually, double-check, if Docusaurus already supports ES modules for config?
// eslint-disable-next-line import/no-commonjs
const { themes } = require('prism-react-renderer');

const CODE_REPO = 'https://github.com/birdofpreyru/react-utils';
const EDIT_BASE = `${CODE_REPO}/edit/master/docs`;

const NPM_URL = 'https://www.npmjs.com/package/@dr.pogodin/react-utils';

const REACT_UTILS_STYLES = process.env.NODE_ENV === 'development'
  // Note: "-forced" version of these style imports does not fallback to null
  // imports on Node, unlike these imports without "-forced" syffixes.
  ? '@dr.pogodin/react-utils/dev-styles-forced'
  : '@dr.pogodin/react-utils/prod-styles-forced';

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
  plugins: ['docusaurus-plugin-sass'],
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
