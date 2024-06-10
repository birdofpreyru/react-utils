// The stuff common between different dropdown implementations.

import PT from 'prop-types';

import type { Theme } from '@dr.pogodin/react-themes';

export const validThemeKeys = [
  'active',
  'arrow',
  'container',
  'dropdown',
  'hiddenOption',
  'label',
  'option',
  'select',

  // TODO: This is only valid for <CustomDropdown>, thus we need to re-factor it
  // into a separate theme spec for that component.
  'upward',
] as const;

export type ValueT = number | string;

export const valueValidator: PT.Requireable<ValueT> = PT.oneOfType([
  PT.number.isRequired,
  PT.string.isRequired,
]);

export type OptionT<NameT> = {
  name?: NameT | null;
  value: ValueT;
};

export type OptionsT<NameT> = Readonly<Array<OptionT<NameT> | ValueT>>;

export type PropsT<
  NameT,
  OnChangeT = React.ChangeEventHandler<HTMLSelectElement>,
> = {
  filter?: (item: OptionT<NameT> | ValueT) => boolean;
  label?: React.ReactNode;
  onChange?: OnChangeT;
  options?: OptionsT<NameT>;
  theme: Theme<typeof validThemeKeys>;
  value?: ValueT;
};

export const optionValidator:
PT.Requireable<OptionT<React.ReactNode> | ValueT> = PT.oneOfType([
  PT.shape({
    name: PT.node,
    value: valueValidator.isRequired,
  }).isRequired,
  PT.number.isRequired,
  PT.string.isRequired,
]);

export const optionsValidator = PT.arrayOf(optionValidator.isRequired);

export const stringOptionValidator:
PT.Requireable<OptionT<string> | ValueT> = PT.oneOfType([
  PT.shape({
    name: PT.string,
    value: valueValidator.isRequired,
  }).isRequired,
  PT.number.isRequired,
  PT.string.isRequired,
]);

export const stringOptionsValidator = PT.arrayOf(stringOptionValidator.isRequired);

function isValue<T>(x: OptionT<T> | ValueT): x is ValueT {
  const type = typeof x;
  return type === 'number' || type === 'string';
}

/** Returns option value and name as a tuple. */
export function optionValueName<NameT>(
  option: OptionT<NameT> | ValueT,
): [ValueT, NameT | ValueT] {
  return isValue(option)
    ? [option, option]
    : [option.value, option.name ?? option.value];
}
