// The <Button> component implements a standard button / button-like link.

import PT from 'prop-types';

import Link from 'components/Link';

import { themed } from 'utils';

import defaultTheme from './style.scss';

function BaseButton({
  active,
  children,
  disabled,
  enforceA,
  onClick,
  onMouseDown,
  openNewTab,
  replace,
  theme,
  to,
}) {
  let className = theme.button;
  if (active && theme.active) className += ` ${theme.active}`;
  if (disabled) {
    if (theme.disabled) className += ` ${theme.disabled}`;
    return (
      <div className={className}>
        {children}
      </div>
    );
  }
  if (to) {
    return (
      <Link
        className={className}
        enforceA={enforceA}
        onClick={onClick}
        onMouseDown={onMouseDown}
        openNewTab={openNewTab}
        replace={replace}
        to={to}
      >
        {children}
      </Link>
    );
  }
  return (
    <div
      className={className}
      onClick={onClick}
      onKeyPress={onClick}
      onMouseDown={onMouseDown}
      role="button"
      tabIndex={0}
    >
      {children}
    </div>
  );
}

/**
 * Button component theme: a map of CSS
 * class names to append to button elements:
 * @prop {string} [active] to the root element of active button.
 * @prop {string} [button] to the root element of any button.
 * @prop {string} [disabled] to the root element of disabled button.
 */
const ThemedButton = themed('Button', [
  'active',
  'button',
  'disabled',
], defaultTheme)(BaseButton);

/**
 * Implements themeable buttons, and button-line links (elements which look
 * like buttons, but behave as links) in the same uniform manner.
 * @param {object} [props] Component props.
 * @param {boolean} [props.active] Set `true` to render the button as
 * active, even if it is not active otherwise.
 * @param {boolean} [props.disabled] Set `true` to disable the button.
 * @param {boolean} [props.enforceA] When the button is rendered as `<Link>`
 * component, this prop enforces it to be rendered as a simple `<a>` element
 * (external link), rather than the React router's internal link.
 * See `<Link>` documentation to learn when links are rendered as `<a>`
 * by default.
 * @param {function} [props.onClick] Click event handler.
 * @param {function} [props.onMouseDown] Mouse down event handler.
 * @param {boolean} [props.openNewTab] Set `true` to open link in the new tab.
 * @param {boolean} [props.replace] When the button is rendered as
 * `<Link>`, and the target URL is internal, this property tells that
 * the new route should replace the last record in the browser's history,
 * rather than to be pushed as a new entry into the history stack.
 * @param {ButtonTheme} [props.theme] _Ad hoc_ button theme.
 * @param {object|string} [props.to] If specified, the button will be rendered
 * as `<Link>` (if not disabled), and it will point to the specified location
 * or URL.
 * @param {...any} [props....]
 * [Other properties of themeable components](https://www.npmjs.com/package/@dr.pogodin/react-themes#themed-component-properties)
 */
BaseButton.defaultProps = {
  active: false,
  children: undefined,
  disabled: false,
  enforceA: false,
  onClick: undefined,
  onMouseDown: undefined,
  openNewTab: false,
  replace: false,
  to: undefined,
};

BaseButton.propTypes = {
  active: PT.bool,
  children: PT.node,
  disabled: PT.bool,
  enforceA: PT.bool,
  onClick: PT.func,
  onMouseDown: PT.func,
  openNewTab: PT.bool,
  replace: PT.bool,
  theme: ThemedButton.themeType.isRequired,
  to: PT.oneOfType([PT.object, PT.string]),
};

export default ThemedButton;
