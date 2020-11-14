/**
 * Auxiliary wrapper around React Helmet that helps to generate meta tags for
 * generic use cases.
 */

import PT from 'prop-types';
import { createContext } from 'react';
import { Helmet } from 'react-helmet';

const Context = createContext();

export default function MetaTags({
  children,
  description,
  image,
  siteName,
  socialDescription,
  socialTitle,
  title,
  url,
}) {
  const socTitle = socialTitle || title;
  const socDesc = socialDescription || description;
  return (
    <>
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
        { image ? <meta name="twitter:image" content={image} /> : null }
        {
          siteName ? (
            <meta name="twitter:site" content={`@${siteName}`} />
          ) : null
        }

        {/* Open Graph data. */}
        <meta name="og:title" content={socTitle} />
        { image ? <meta name="og:image" content={image} /> : null }
        { image ? <meta name="og:image:alt" content={socTitle} /> : null }
        <meta name="og:description" content={socDesc} />
        {
          siteName ? (<meta name="og:sitename" content={siteName} />) : null
        }
        { url ? (<meta name="og:url" content={url} />) : null }
      </Helmet>
      {
        children ? (
          <Context.Provider
            value={{
              description,
              image,
              siteName,
              socialDescription,
              socialTitle,
              title,
              url,
            }}
          >
            {children}
          </Context.Provider>
        ) : null
      }
    </>
  );
}

MetaTags.Context = Context;

MetaTags.defaultProps = {
  children: null,
  image: null,
  siteName: null,
  socialDescription: null,
  socialTitle: null,
  url: null,
};

MetaTags.propTypes = {
  children: PT.node,
  description: PT.string.isRequired,
  image: PT.string,
  siteName: PT.string,
  socialDescription: PT.string,
  socialTitle: PT.string,
  title: PT.string.isRequired,
  url: PT.string,
};
