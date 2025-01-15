import {
  type Context as ContextT,
  type FunctionComponent,
  type ReactNode,
  createContext,
  useMemo,
} from 'react';

import { Helmet } from 'react-helmet-async';

type PropsT = {
  children?: ReactNode;
  description: string;
  extraMetaTags?: Array<{
    content: string;
    name: string;
  }>;
  image?: string;
  siteName?: string;
  socialDescription?: string;
  socialTitle?: string;
  title: string;
  url?: string;
};

const Context = createContext<PropsT>({
  description: '',
  title: '',
});

/**
 * Auxiliary wrapper around "react-helmet", which helps to inject meta tags
 * (page title, a brief content description, and social media thumbnails) into
 * generated pages.
 */
const MetaTags: FunctionComponent<PropsT> & {
  Context: ContextT<PropsT>;
} = ({
  children,
  description,
  extraMetaTags,
  image,
  siteName,
  socialDescription,
  socialTitle,
  title,
  url,
}) => {
  const socTitle = socialTitle || title;
  const socDesc = socialDescription || description;

  const context = useMemo(() => ({
    description,
    image,
    siteName,
    socialDescription,
    socialTitle,
    title,
    url,
  }), [
    description,
    image,
    siteName,
    socialDescription,
    socialTitle,
    title,
    url,
  ]);

  const extra: ReactNode[] = [];
  if (extraMetaTags?.length) {
    for (let i = 0; i < extraMetaTags.length; ++i) {
      const { content, name } = extraMetaTags[i]!;
      extra.push(
        <meta
          content={content}
          name={name}
          key={`extra-meta-tag-${i}`}
        />,
      );
    }
  }

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
        {extra}
      </Helmet>
      {
        children ? (
          <Context.Provider value={context}>
            {children}
          </Context.Provider>
        ) : null
      }
    </>
  );
};

MetaTags.Context = Context;

export default MetaTags;
