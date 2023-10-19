import PT from 'prop-types';
import { useContext } from 'react';

import MetaTags from 'components/MetaTags';

export const MODES = {
  BASIC_NO_OVERRIDE: 0,
  BASIC_WITH_OVERRIDE: 1,
};

function Component() {
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
}

export default function Application({ mode }) {
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
}

Application.propTypes = {
  mode: PT.oneOf(Object.values(MODES)).isRequired,
};
