import { noop, omit } from 'lodash';
import Button from 'components/Button';
import { snapshot } from 'utils/jest';
import { StaticRouter } from 'react-router-dom/server';

const testTheme = {
  active: 'ACTIVE_CLASS',
  ad: 'AD_TAG',
  button: 'BUTTON_CLASS',
  context: 'CONTEXT_TAG',
  disabled: 'DISABLED_CLASS',
  hoc: 'HOC_TAG',
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
      <StaticRouter future={{ v7_relativeSplatPath: true }} location="">
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
