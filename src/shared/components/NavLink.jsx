import { NavLink as RrNavLink } from 'react-router-dom';

import GenericLink from './GenericLink';

export default function NavLink(props) {
  /* eslint-disable react/jsx-props-no-spreading */
  return <GenericLink {...props} routerLinkType={RrNavLink} />;
  /* eslint-enable react/jsx-props-no-spreading */
}
