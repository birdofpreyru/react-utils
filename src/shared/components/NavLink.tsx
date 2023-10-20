import { NavLink as RrNavLink } from 'react-router-dom';

import GenericLink, { type PropsT as GenericLinkPropsT } from './GenericLink';

type PropsT = Omit<GenericLinkPropsT, 'routerLinkType'>;

export default function NavLink(props: PropsT) {
  /* eslint-disable react/jsx-props-no-spreading */
  return <GenericLink {...props} routerLinkType={RrNavLink} />;
  /* eslint-enable react/jsx-props-no-spreading */
}
