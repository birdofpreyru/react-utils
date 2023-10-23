import PT from 'prop-types';
import { forwardRef } from 'react';

import themed, { type Theme } from '@dr.pogodin/react-themes';

import defaultTheme from './theme.scss';

type PropsT = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  theme: Theme & {
    container?: string;
    input?: string;
    label?: string;
  };
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
    { label === undefined ? null : <p className={theme.label}>{label}</p> }
    <input
      className={theme.input}
      ref={ref}
      {...rest} // eslint-disable-line react/jsx-props-no-spreading
    />
  </span>
));

const ThemedInput = themed(Input, 'Input', [
  'container',
  'input',
  'label',
], defaultTheme);

Input.propTypes = {
  label: PT.string,
  theme: ThemedInput.themeType.isRequired,
};

Input.defaultProps = {
  label: undefined,
};

export default ThemedInput;
