import PT from 'prop-types';

import MetaTags from 'components/MetaTags';

export const MODES = {
  BASIC_NO_OVERRIDE: 0,
  BASIC_WITH_OVERRIDE: 1,
  ALL_TAGS_WITH_OVERRIDE: 2,
};

function Component() {
  return (
    <div>
      <p>A dummy internal component.</p>
      <MetaTags
        title="Title from Component"
        description="Component description"
      />
    </div>
  );
}

function AllTagsComponent() {
  return (
    <div>
      <p>A dummy internal component.</p>
      <MetaTags
        title="Title from Component"
        description="Component description"
        image="/THUMBNAIL_PATH"
        siteName="SITE_NAME"
        socialDescription="SOCIAL_DESCRIPTION"
        socialTitle="SOCIAL_TITLE"
        url="PAGE_URL"
      />
    </div>
  );
}

export default function Application({ mode }) {
  let component;
  switch (mode) {
    case MODES.BASIC_WITH_OVERRIDE: component = <Component />; break;
    case MODES.ALL_TAGS_WITH_OVERRIDE: component = <AllTagsComponent />; break;
    default: component = null;
  }

  return (
    <div>
      <p>Hello World!</p>
      <MetaTags
        title="Application Title"
        description="Application Description"
      />
      {component}
    </div>
  );
}

Application.propTypes = {
  mode: PT.oneOf(Object.values(MODES)).isRequired,
};
