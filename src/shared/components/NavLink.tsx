import { type NavLinkProps, NavLink as RrNavLink } from 'react-router';

import GenericLink, { type PropsT as GenericLinkPropsT } from './GenericLink';

type PropsT = Omit<GenericLinkPropsT, 'routerLinkType'> & NavLinkProps;

const NavLink: React.FunctionComponent<PropsT>
  = (props) => (
    <GenericLink
      // TODO: I guess, we better re-write it to avoid the props spreading,
      // but no need to spend time on it right now.
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      routerLinkType={RrNavLink}
    />
  );

export default NavLink;
