module.exports = {
  extends: 'stylelint-config-standard-scss',
  rules: {
    'at-rule-no-unknown': [true, {
      ignoreAtRules: [
        'content',
        'each',
        'extend',
        'for',
        'include',
        'mixin',
        'use',
      ],
    }],
    'selector-class-pattern': null,
    'selector-pseudo-class-no-unknown': [
      true, { ignorePseudoClasses: ['global'] },
    ],
  },
};
