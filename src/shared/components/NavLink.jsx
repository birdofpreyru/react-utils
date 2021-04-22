import { NavLink as RrNavLink } from 'react-router-dom';

import GenericLink from './GenericLink';

/**
 * @category Components
 * @func NavLink
 * @desc
 * ```js
 * import { NavLink } from '@dr.pogodin/react-utils';
 * ```
 * See {@link Link} documentation.
 * @param {object} [props] Component properties.
 */
export default function NavLink(props) {
  /* eslint-disable react/jsx-props-no-spreading */
  return <GenericLink {...props} routerLinkType={RrNavLink} />;
  /* eslint-enable react/jsx-props-no-spreading */
}
