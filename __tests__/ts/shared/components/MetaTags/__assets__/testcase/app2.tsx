import { useContext } from 'react';

import MetaTags from 'components/MetaTags';

export enum MODES {
  BASIC_NO_OVERRIDE = 0,
  BASIC_WITH_OVERRIDE = 1,
}

const Component = () => {
  const { title, description } = useContext(MetaTags.Context);
  return (
    <div>
      <p>A dummy internal component.</p>
      <MetaTags
        title={`Title from Component - ${title}`}
        description={`Component description - ${description}`}
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
    case MODES.BASIC_WITH_OVERRIDE: component = <Component />; break;
    default: component = null;
  }

  return (
    <div>
      <p>Hello World!</p>
      <MetaTags
        title="Application Title"
        description="Application Description"
      >
        {component}
      </MetaTags>
    </div>
  );
};

export default Application;
