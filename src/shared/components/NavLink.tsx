import { type NavLinkProps, NavLink as RrNavLink } from 'react-router';

import GenericLink, { type PropsT as GenericLinkPropsT } from './GenericLink';

type PropsT = Omit<GenericLinkPropsT, 'routerLinkType'> & NavLinkProps;

const NavLink: React.FunctionComponent<PropsT>
  = (props) => <GenericLink {...props} routerLinkType={RrNavLink} />;

export default NavLink;
