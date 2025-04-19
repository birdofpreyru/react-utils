import { useGlobalState } from '@dr.pogodin/react-global-state';

import MetaTags from 'components/MetaTags';

export enum MODES {
  BASIC_NO_OVERRIDE = 0,
  BASIC_WITH_OVERRIDE = 1,
  ALL_TAGS_WITH_OVERRIDE = 2,
}

const Component = () => (
  <div>
    <p>A dummy internal component.</p>
    <MetaTags
      description="Component description"
      title="Title from Component"
    />
  </div>
);

const AllTagsComponent = () => {
  const [domain] = useGlobalState('domain');
  return (
    <div>
      <p>A dummy internal component.</p>
      <MetaTags
        description="Component description"
        image={`${domain as unknown as string}/THUMBNAIL_PATH`}
        siteName="SITE_NAME"
        socialDescription="SOCIAL_DESCRIPTION"
        socialTitle="SOCIAL_TITLE"
        title="Title from Component"
        url="PAGE_URL"
      />
    </div>
  );
};

type PropsT = {
  mode: MODES;
};

const Application: React.FunctionComponent<PropsT> = ({ mode }) => {
  let component;
  switch (mode) {
    case MODES.BASIC_WITH_OVERRIDE:
      component = <Component />;
      break;
    case MODES.ALL_TAGS_WITH_OVERRIDE:
      component = <AllTagsComponent />;
      break;
    case MODES.BASIC_NO_OVERRIDE:
    default: component = null;
  }

  return (
    <div>
      <p>Hello World!</p>
      <MetaTags
        description="Application Description"
        title="Application Title"
      />
      {component}
    </div>
  );
};

export default Application;
