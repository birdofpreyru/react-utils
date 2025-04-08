// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

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
  title: 'React Utils',
  tagline: 'ReactJS development kit.',
  url: 'https://dr.pogodin.studio',
  baseUrl: '/docs/react-utils/',
  onBrokenAnchors: 'throw',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'throw',
  favicon: 'img/favicon.ico',
  plugins: ['docusaurus-plugin-sass'],

  presets: [
    [
      '@docusaurus/preset-classic',

      /** @type {import('@docusaurus/preset-classic').Options} */
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: EDIT_BASE,
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

  themeConfig: /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    {
      navbar: {
        logo: {
          alt: 'Dr. Pogodin Studio',
          src: 'img/logo-verbose.svg',
          href: 'https://dr.pogodin.studio',
        },
        items: [
          {
            to: '/',
            label: 'React Utils',
            activeBaseRegex: '^/docs/react-utils/$',
          },
          {
            type: 'doc',
            docId: 'tutorials/index',
            position: 'left',
            label: 'Getting Started',
          },
          {
            type: 'doc',
            docId: 'api/index',
            position: 'left',
            label: 'API',
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
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              { label: 'API', to: '/docs/api' },
              { label: 'Getting Started', to: '/docs/tutorials' },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'GitHub',
                href: CODE_REPO,
              },
              {
                label: 'NPM',
                href: NPM_URL,
              },
            ],
          },
        ],
        copyright: `Copyright © 2019&ndash;${new Date().getFullYear()}, Dr. Sergey Pogodin`,
      },
      prism: {
        theme: themes.github,
        darkTheme: themes.dracula,
      },
    },
};

module.exports = config;
