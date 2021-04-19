/* global window */

import PT from 'prop-types';
import { createElement } from 'react';

import './style.scss';

/**
 * @category Components
 * @func Link
 * @desc
 * ```js
 * import { Link } from '@dr.pogodin/react-utils';
 * ```
 * The `<Link>` component, and almost identical `<NavLink>` component, are
 * auxiliary wrappers around
 * [React Router](https://github.com/ReactTraining/react-router)'s
 * `<Link>` and `<NavLink>` components; they help to handle external and
 * internal links in uniform manner.
 *
 * The `<Link>` (`<NavLink>`) component is rendered as a simple `<a>` element
 * when:
 * 1. The link is absolute, i.e. starts with `http://` or `https://`.
 * 2. The link points to an anchor, i.e. starts with `#` symbol.
 * 3. The link should be opened in a new tab (`openNewTab` property).
 * 4. Explicitly opted by the `enforceA` property.
 *
 * Otherwise it is rendered as the usual React Router's `<Link>` (`<NavLink>`).
 * Also in this case links to the current page scroll the page to its top when
 * clicked.
 *
 * Both `<Link>` and `<NavLink>` support all properties of the underlying React
 * Router's components, along with some additional props:
 *
 * **Children:** Child components are rendered as link's content.
 *
 * @param {object} [props] Component properties.
 * @param {string} [props.className] CSS classes to apply to the link.
 * @param {boolean} [props.disabled] Disables the link.
 * @param {boolean} [props.enforceA] `true` enforces rendering of the link as
 * a simple `<a>` element.
 * @param {boolean} [props.keepScrollPosition] If `true`, and the link is
 * rendered as a React Router's component, it won't reset the viewport scrolling
 * position to the origin when clicked.
 * @param {function} [props.onClick] Event handler to trigger upon click.
 * @param {function} [props.onMouseDown] Event handler to trigger on MouseDown
 * event.
 * @param {boolean} [props.openNewTab] If `true` the link opens in a new tab.
 * @param {boolean} [props.replace] When `true`, the link will replace current
 * entry in the history stack instead of adding a new one.
 * @param {string} [props.to] Link URL.
 * @param {string} [props.activeClassName] **`<NavLink>`** only: CSS class(es)
 * to apply to rendered link when it is active.
 * @param {string} [props.activeStyle] **`<NavLink>`** only: CSS styles
 * to apply to the rendered link when it is active.
 * @param {boolean} [props.exact] **`<NavLink>`** only: if `true`, the active
 * class/style will only be applied if the location is matched exactly.
 * @param {function} [props.isActive] **`<NavLink>`** only: Add extra
 * logic for determining whether the link is active. This should be used if you
 * want to do more than verify that the link’s pathname matches the current URL
 * pathname.
 * @param {object} [props.location] **`<NavLink>`** only: `isActive` compares
 * current history location (usually the current browser URL). To compare to
 * a different location, a custom `location` can be passed.
 * @param {boolean} [props.strict] **`<NavLink>`** only: . When `true`, trailing
 * slash on a location’s pathname will be taken into consideration when
 * determining if the location matches the current URL. See the `<Route strict>`
 * documentation for more information.
 */
export default function GenericLink({
  children,
  className,
  disabled,
  enforceA,
  keepScrollPosition,
  onClick,
  onMouseDown,
  openNewTab,
  replace,
  routerLinkType,
  to,
  ...rest
}) {
  /* Renders Link as <a> element if:
   * - It is opted explicitely by `enforceA` prop;
   * - It should be opened in a new tab;
   * - It is an absolte URL (starts with http:// or https://);
   * - It is anchor link (starts with #). */
  if (disabled || enforceA || openNewTab || to.match(/^(#|(https?|mailto):)/)) {
    return (
      <a
        className={className}
        disabled={disabled}
        href={to}
        onClick={disabled ? (e) => e.preventDefault() : onClick}
        onMouseDown={disabled ? (e) => e.preventDefault() : onMouseDown}
        rel="noopener noreferrer"
        styleName="link"
        target={openNewTab ? '_blank' : ''}
      >
        {children}
      </a>
    );
  }

  /* Otherwise we render the link as React Router's Link or NavLink element. */
  return createElement(routerLinkType, {
    className,
    disabled,
    onMouseDown,
    replace,
    to,
    onClick: (e) => {
      // Executes the user-provided event handler, if any.
      if (onClick) onClick(e);

      // By default, clicking the link scrolls the page to beginning.
      if (!keepScrollPosition) window.scroll(0, 0);
    },
    ...rest,
  }, children);
}

GenericLink.defaultProps = {
  children: null,
  className: null,
  disabled: false,
  enforceA: false,
  keepScrollPosition: false,
  onClick: null,
  onMouseDown: null,
  openNewTab: false,
  replace: false,
  to: '',
};

GenericLink.propTypes = {
  children: PT.node,
  className: PT.string,
  disabled: PT.bool,
  enforceA: PT.bool,
  keepScrollPosition: PT.bool,
  onClick: PT.func,
  onMouseDown: PT.func,
  openNewTab: PT.bool,
  replace: PT.bool,
  routerLinkType: PT.elementType.isRequired,
  to: PT.oneOfType([PT.object, PT.string]),
};
