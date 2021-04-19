module.exports = {
  opts: {
    destination: 'new-docs',
    readme: 'src/README.md',
    recurse: true,
    template: 'node_modules/better-docs',
  },
  plugins: [
    'plugins/markdown',
    'node_modules/better-docs/category',
  ],
  source: {
    include: ['bin', 'config', 'src'],
  },
  tags: {
    allowUnknownTags: ['category', 'subcategory'],
  },
  templates: {
    'better-docs': {
      hideGenerator: true,
      name: 'React Utils',
      navLinks: [{
        label: 'GitHub',
        href: 'https://github.com/birdofpreyru/react-utils',
      }, {
        label: 'NPM',
        href: 'https://www.npmjs.com/package/@dr.pogodin/react-utils',
      }, {
        label: 'Studio',
        href: 'https://dr.pogodin.studio/',
      }],
    },
  },
};
