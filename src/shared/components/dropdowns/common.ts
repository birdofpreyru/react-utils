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
] as const;

export type DropdownOptionT<NameT> = {
  name?: NameT | null;
  value: string;
};

export type OptionsT<NameT> = Array<DropdownOptionT<NameT> | string>;

export type PropsT<
  NameT,
  OnChangeT = React.ChangeEventHandler<HTMLSelectElement>,
> = {
  filter?: (item: DropdownOptionT<NameT> | string) => boolean;
  label?: React.ReactNode;
  onChange?: OnChangeT;
  options?: OptionsT<NameT>;
  theme: Theme<typeof validThemeKeys>;
  value?: string;
};

export const optionValidator = PT.oneOfType([
  PT.shape({
    name: PT.string,
    value: PT.string.isRequired,
  }).isRequired,
  PT.string.isRequired,
]);

export const optionsValidator = PT.arrayOf(optionValidator.isRequired);

/** Returns option value and name as a tuple. */
export function optionValueName<NameT>(
  option: DropdownOptionT<NameT> | string,
): [string, NameT | string] {
  return typeof option === 'string'
    ? [option, option]
    : [option.value, option.name ?? option.value];
}
