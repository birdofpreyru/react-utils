// The stuff common between different dropdown implementations.

import type { Theme } from '@dr.pogodin/react-themes';

export type ThemeT = Theme<
  | 'active'
  | 'arrow'
  | 'container'
  | 'dropdown'
  | 'hiddenOption'
  | 'label'
  | 'option'
  | 'select'

  // TODO: This is currently only valid for (native) <Dropdown>,
  // other kinds of selectors should be evaluated, and aligned with this
  // feature, if appropriate.
  | 'invalid'

  // TODO: This is only valid for <CustomDropdown>, thus we need to re-factor it
  // into a separate theme spec for that component.
  | 'upward'
>;

export type ValueT = number | string;

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
  options: Readonly<OptionsT<NameT>>;
  testId?: string;
  theme: ThemeT;
  value?: ValueT;
};

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
