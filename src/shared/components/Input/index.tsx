import { forwardRef } from 'react';

import themed, { type Theme } from '@dr.pogodin/react-themes';

import defaultTheme from './theme.scss';

type ThemeKeyT =
  | 'container'
  | 'input'
  | 'label';

type PropsT = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: React.ReactNode;
  theme: Theme<ThemeKeyT>;
};

/**
 * Themeable input field, based on the standard HTML `<input>` element.
 * @param [props]
 * @param [props.label] Input label.
 * @param [props.theme] _Ad hoc_ theme.
 * @param [props...] [Other theming properties](https://www.npmjs.com/package/@dr.pogodin/react-themes#themed-component-properties)
 * @param [props...] Any other properties are passed to the underlying
 * `<input>` element.
 */
const Input = forwardRef<HTMLInputElement, PropsT>((
  {
    label,
    theme,
    ...rest
  }: PropsT,
  ref,
) => (
  <span className={theme.container}>
    { label === undefined ? null : <div className={theme.label}>{label}</div> }
    <input
      className={theme.input}
      ref={ref}
      {...rest} // eslint-disable-line react/jsx-props-no-spreading
    />
  </span>
));

export default themed(Input, 'Input', defaultTheme);
