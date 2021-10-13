module.exports = {
  extends: 'stylelint-config-standard',
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
    'selector-pseudo-class-no-unknown': [
      true, { ignorePseudoClasses: ['global'] },
    ],
  },
};
