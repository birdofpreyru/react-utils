import type { ReactNode } from 'react';

import type {
  Link,
  LinkProps,
  NavLink,
  NavLinkProps,
} from 'react-router';

import './style.scss';

type LinkT = typeof Link;
type NavLinkT = typeof NavLink;

type ToT = Parameters<typeof Link>[0]['to'];

export type PropsT = {
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
  enforceA?: boolean;
  keepScrollPosition?: boolean;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  onMouseDown?: React.MouseEventHandler<HTMLAnchorElement>;
  openNewTab?: boolean;
  replace?: boolean;
  routerLinkType: LinkT | NavLinkT;
  to: ToT;
};

/**
 * The `<Link>` component, and almost identical `<NavLink>` component, are
 * auxiliary wrappers around
 * [React Router](https://github.com/ReactTraining/react-router)'s
 * `<Link>` and `<NavLink>` components; they help to handle external and
 * internal links in uniform manner.
 *
 * @param [props] Component properties.
 * @param [props.className] CSS classes to apply to the link.
 * @param [props.disabled] Disables the link.
 * @param [props.enforceA] `true` enforces rendering of the link as
 * a simple `<a>` element.
 * @param [props.keepScrollPosition] If `true`, and the link is
 * rendered as a React Router's component, it won't reset the viewport scrolling
 * position to the origin when clicked.
 * @param [props.onClick] Event handler to trigger upon click.
 * @param [props.onMouseDown] Event handler to trigger on MouseDown
 * event.
 * @param [props.openNewTab] If `true` the link opens in a new tab.
 * @param [props.replace] When `true`, the link will replace current
 * entry in the history stack instead of adding a new one.
 * @param [props.to] Link URL.
 * @param [props.activeClassName] **`<NavLink>`** only: CSS class(es)
 * to apply to rendered link when it is active.
 * @param [props.activeStyle] **`<NavLink>`** only: CSS styles
 * to apply to the rendered link when it is active.
 * @param [props.exact] **`<NavLink>`** only: if `true`, the active
 * class/style will only be applied if the location is matched exactly.
 * @param [props.isActive] **`<NavLink>`** only: Add extra
 * logic for determining whether the link is active. This should be used if you
 * want to do more than verify that the link’s pathname matches the current URL
 * pathname.
 * @param [props.location] **`<NavLink>`** only: `isActive` compares
 * current history location (usually the current browser URL). To compare to
 * a different location, a custom `location` can be passed.
 * @param [props.strict] **`<NavLink>`** only: . When `true`, trailing
 * slash on a location’s pathname will be taken into consideration when
 * determining if the location matches the current URL. See the `<Route strict>`
 * documentation for more information.
 */
const GenericLink = ({
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
}: (LinkProps | NavLinkProps) & PropsT): ReactNode => {
  /* Renders Link as <a> element if:
   * - It is opted explicitely by `enforceA` prop;
   * - It should be opened in a new tab;
   * - It is an absolte URL (starts with http:// or https://);
   * - It is anchor link (starts with #). */
  if (disabled || enforceA || openNewTab
    || (to as string)?.match(/^(#|(https?|mailto):)/)) {
    return (
      <a
        className={className}
        // TODO: This requires a fix: disabled is not really an attribute of <a>
        // tag, thus for disabled option we rather should render a plain text
        // styled as a link.
        // disabled={disabled}
        href={to as string}
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

  const L = routerLinkType;

  return (
    <L
      className={className}
      discover="none"
      // disabled
      onMouseDown={onMouseDown}
      replace={replace}
      to={to}
      onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
        // Executes the user-provided event handler, if any.
        if (onClick) onClick(e);

        // By default, clicking the link scrolls the page to beginning.
        if (!keepScrollPosition) window.scroll(0, 0);
      }}
      {...rest}
    >
      {children}
    </L>
  );
};

export default GenericLink;
