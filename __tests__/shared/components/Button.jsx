import _ from 'lodash';
import Button from 'components/Button';
import { snapshot } from 'utils/jest';
import { StaticRouter } from 'react-router-dom/server';

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
        onClick={_.noop}
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
        onClick={_.noop}
        theme={testTheme}
      >
        BUTTON
      </Button>
    ));
    snapshot((
      <Button
        disabled
        onClick={_.noop}
        theme={_.omit(testTheme, 'disabled')}
      >
        BUTTON
      </Button>
    ));
  });
  test('when rendered as link', () => {
    snapshot((
      <StaticRouter location="/">
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
