import { use } from 'react';

import MetaTags from 'components/MetaTags';

export enum MODES {
  BASIC_NO_OVERRIDE = 0,
  BASIC_WITH_OVERRIDE = 1,
}

const Component = () => {
  const { title, description } = use(MetaTags.Context);
  return (
    <div>
      <p>A dummy internal component.</p>
      <MetaTags
        description={`Component description - ${description}`}
        title={`Title from Component - ${title}`}
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
    case MODES.BASIC_NO_OVERRIDE:
    default: component = null;
  }

  return (
    <div>
      <p>Hello World!</p>
      <MetaTags
        description="Application Description"
        title="Application Title"
      >
        {component}
      </MetaTags>
    </div>
  );
};

export default Application;
