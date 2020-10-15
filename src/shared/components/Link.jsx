/**
 * The Link wraps around React Router's Link component, to automatically replace
 * it by the regular <a> element when:
 * - The target reference points to another domain;
 * - User opts to open the reference in a new tab;
 * - User explicitely opts to use <a>.
 */

import { Link as RrLink } from 'react-router-dom';

import GenericLink from './GenericLink';

export default function Link(props) {
  /* eslint-disable react/jsx-props-no-spreading */
  return <GenericLink {...props} routerLinkType={RrLink} />;
  /* eslint-enable react/jsx-props-no-spreading */
}
