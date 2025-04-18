/* global module */

const camelCaseRegex = /^[a-z][a-zA-Z0-9]+$/;
const kebabCase = /^([a-z][a-z0-9]*)(-[a-z0-9]+)*$/;

const namePattern = new RegExp(
  `(${camelCaseRegex.source})|(${kebabCase.source})`,
);

// eslint-disable-next-line import/no-commonjs
module.exports = {
  extends: 'stylelint-config-standard-scss',
  rules: {
    'at-rule-no-unknown': [true, {
      ignoreAtRules: [
        'content',
        'each',
        'extend',
        'for',
        'forward',
        'include',
        'mixin',
        'use',
      ],
    }],
    'custom-property-pattern': namePattern,
    'keyframes-name-pattern': namePattern,
    'scss/at-mixin-pattern': namePattern,
    'scss/dollar-variable-pattern': namePattern,
    'selector-class-pattern': null,
    'selector-pseudo-class-no-unknown': [
      true, { ignorePseudoClasses: ['global'] },
    ],
  },
};
