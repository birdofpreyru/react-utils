import PT from 'prop-types';
import { createContext, useMemo } from 'react';
import { Helmet } from 'react-helmet';

const Context = createContext();

/**
 * The `<MetaTags>` component is an auxiliary wrapper around `react-helmet`,
 * which helps to inject meta tags (page title, a brief content description,
 * and social media thumbnails) into generated pages.
 *
 * When `<MetaTags>` are nested within the app's component tree, meta tags
 * content injected by components encountered down the tree overrides tags
 * injected by previously encountered `<MetaTags>` components.
 *
 * **Children:** `<MetaTags>` children, if any, are rendered at the component's
 * location. The context passes down all meta tag properties of parent
 * `<MetaTag>` instances. These properties can fetched within children
 * hierarchy in the following way, thus facilitating tags modification by
 * children:
 * ```jsx
 * import { useContext } from 'react';
 * import { MetaTags } from '@dr.pogodin/react-utils';
 * export default function SampleComponent() {
 *   const { title, description, ...rest } = useContext(MetaTags.Context);
 *   // Do something with these props here, e.g. prefix the page title with
 *   // the component name:
 *   return (
 *     <MetaTags title={`Sample component - ${title}`} />
 *   );
 * }
 * ```
 * @param {object} [props]
 * @param {string} [props.description] Page description to use in
 * the `description` meta tag, and as a default description of Open Graph Tags.
 * @param {string} [props.image] The absolute URL of thumbnail image to use
 * in Open Graph Tags (`twitter:image`, and `og:image`). By default these tags
 * are not injected.
 *
 * **BEWARE:** It must be a complete, absolute URL, including the correct
 * website domain and HTTP schema.
 *
 * @param {string} [props.siteName]: The site name to use in `twitter:site`,
 * and `og:sitename` tags. By default these tags are not injected.
 *
 * @param {string} [props.socialDescription] The site description to use in
 * `twitter:description` and `og:description` meta tags. By default the value of
 * `description` prop is used.
 * @param {string} [props.socialTitle] The page title to use in
 * `twitter:title`, `og:title`, and `og:image:alt` tags. By default the value of
 * `title` prop is used. Also the `og:image:alt` tag is only injected if `image`
 * prop is present.
 *
 * @param {string} props.title: The page name to use in the `<title>` tag.
 * It is also used as the default value of `socialTitle` prop.
 *
 * @param {string} [props.url] The page URL to use in `og:url` tag.
 * By default the tag is not injected.
 */
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
          <Context.Provider value={context}>
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
