import { type NavLinkProps, NavLink as RrNavLink } from 'react-router-dom';

import GenericLink, { type PropsT as GenericLinkPropsT } from './GenericLink';

type PropsT = Omit<GenericLinkPropsT, 'routerLinkType'> & NavLinkProps;

const NavLink: React.FunctionComponent<PropsT> = (props) => (
  /* eslint-disable react/jsx-props-no-spreading */
  <GenericLink {...props} routerLinkType={RrNavLink} />
  /* eslint-enable react/jsx-props-no-spreading */
);

export default NavLink;
