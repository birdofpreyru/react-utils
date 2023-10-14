import { noop, omit } from 'lodash';
import { StaticRouter } from 'react-router-dom/server';

import Button from 'components/Button';
import { snapshot } from 'utils/jest';

const testTheme = {
  active: 'ACTIVE_CLASS',
  button: 'BUTTON_CLASS',
  disabled: 'DISABLED_CLASS',
};

describe('Matches snapshots', () => {
  test('when active', () => {
    snapshot((
      <Button
        active
        onClick={noop}
        theme={testTheme}
      >
        BUTTON
      </Button>
    ));
  });
  test('when disabled', () => {
    snapshot((
      <Button
        disabled
        onClick={noop}
        theme={testTheme}
      >
        BUTTON
      </Button>
    ));
    snapshot((
      <Button
        disabled
        onClick={noop}
        theme={omit(testTheme, 'disabled')}
      >
        BUTTON
      </Button>
    ));
  });
  test('when rendered as link', () => {
    snapshot((
      <StaticRouter>
        <Button
          active
          theme={testTheme}
          to="/SOME/TEST/URL"
        >
          BUTTON
        </Button>
      </StaticRouter>
    ));
  });
});
