module.exports = {
  extends: ['airbnb', 'airbnb/hooks', 'airbnb-typescript'],
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    'jsx-a11y/anchor-is-valid': ['error', {
      components: [],
      specialLink: ['hrefLeft', 'hrefRight'],
      aspects: ['invalidHref', 'noHref', 'preferButton'],
    }],
    'no-plusplus': 0,

    // In TypeScript arrow-functions are better for component definitions as
    // they allow typing like this, which helps to avoid many errors early:
    // const Component: React.FunctionComponent<Props> = ({ ... }) => { ... };
    'react/function-component-definition': ['error', {
      namedComponents: 'arrow-function',
      unnamedComponents: 'arrow-function',
    }],

    'react/jsx-one-expression-per-line': 0,
    'react/jsx-uses-react': 0,
    'react/no-unknown-property': ['error', {
      ignore: ['styleName'],
    }],
    'react/react-in-jsx-scope': 0,

    // TODO: .defaultProps will be deprecated in React@19.
    // Remove this rule override once AirBnB ESLint config is updated.
    // (also remove it from sibling .json configs)
    'react/require-default-props': 0,
  },
  settings: {
    'import/resolver': {
      'babel-module': {},
    },
  },
};
