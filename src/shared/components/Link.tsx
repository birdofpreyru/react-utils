/**
 * The Link wraps around React Router's Link component, to automatically replace
 * it by the regular <a> element when:
 * - The target reference points to another domain;
 * - User opts to open the reference in a new tab;
 * - User explicitely opts to use <a>.
 */

import { type LinkProps, Link as RrLink } from 'react-router';

import GenericLink, { type PropsT as GenericLinkPropsT } from './GenericLink';

type PropsT = Omit<GenericLinkPropsT, 'routerLinkType'> & LinkProps;

const Link: React.FunctionComponent<PropsT>
  = (props) => <GenericLink {...props} routerLinkType={RrLink} />;

export default Link;
