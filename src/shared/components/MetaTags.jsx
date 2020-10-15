/**
 * Auxiliary wrapper around React Helmet that helps to generate meta tags for
 * generic use cases.
 *
 * NOTE: This component relies on `domain` path of global state to hold
 * the current app domain, which will serve as the base path for the bundled
 * images.
 */

import { useGlobalState } from '@dr.pogodin/react-global-state';
import PT from 'prop-types';
import { Helmet } from 'react-helmet';

export default function MetaTags({
  description,
  image,
  siteName,
  socialDescription,
  socialTitle,
  title,
  url,
}) {
  const [domain] = useGlobalState('domain');
  const img = `${domain}${image}`;
  const socTitle = socialTitle || title;
  const socDesc = socialDescription || description;
  return (
    <Helmet>
      {/* General tags. */}
      <title>
        {title}
      </title>
      <meta name="description" content={description} />

      {/* Twitter cards. */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={socTitle} />
      <meta name="twitter:description" content={socDesc} />
      { image ? <meta name="twitter:image" content={img} /> : null }
      {
        siteName ? (
          <meta name="twitter:site" content={`@${siteName}`} />
        ) : null
      }

      {/* Open Graph data. */}
      <meta name="og:title" content={socTitle} />
      { image ? <meta name="og:image" content={img} /> : null }
      { image ? <meta name="og:image:alt" content={socTitle} /> : null }
      <meta name="og:description" content={socDesc} />
      {
        siteName ? (<meta name="og:sitename" content={siteName} />) : null
      }
      { url ? (<meta name="og:url" content={url} />) : null }
    </Helmet>
  );
}

MetaTags.defaultProps = {
  image: null,
  siteName: null,
  socialDescription: null,
  socialTitle: null,
  url: null,
};

MetaTags.propTypes = {
  description: PT.string.isRequired,
  image: PT.string,
  siteName: PT.string,
  socialDescription: PT.string,
  socialTitle: PT.string,
  title: PT.string.isRequired,
  url: PT.string,
};
