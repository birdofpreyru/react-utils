import PT from 'prop-types';

import { themed } from 'utils';

import defaultTheme from './theme.scss';

/**
 * @category Components
 * @desc
 * ```js
 * import { Input } from '@dr.pogodin/react-utils';
 * ```
 * Themeable input field, based on the standard HTML `<input>` element.
 * @param {object} [props]
 * @param {string} [props.label] Input label.
 * @param {InputTheme} [props.theme] _Ad hoc_ theme.
 * @param {...any} [props....] [Other theming properties](https://www.npmjs.com/package/@dr.pogodin/react-themes#themed-component-properties)
 * @param {...any} [props....] Any other properties are passed to the underlying
 * `<input>` element.
 */
function Input({
  label,
  theme,
  ...rest
}) {
  return (
    <div className={theme.container}>
      { label === undefined ? null : <p className={theme.label}>{label}</p> }
      <input
        className={theme.input}
        {...rest} // eslint-disable-line react/jsx-props-no-spreading
      />
    </div>
  );
}

/**
 * @category Components
 * @typedef {object} InputTheme {@link Input} component theme.
 * @prop {string} [container] Class name for root component element.
 * @prop {string} [input] Class name for the underlying HTML `<input>` element.
 * @prop {string} [label] Class name for label element.
 */
const ThemedInput = themed('Input', [
  'container',
  'input',
  'label',
], defaultTheme)(Input);

Input.propTypes = {
  label: PT.string,
  theme: ThemedInput.themeType.isRequired,
};

Input.defaultProps = {
  label: undefined,
};

export default ThemedInput;
