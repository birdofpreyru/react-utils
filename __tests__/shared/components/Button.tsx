/** @jest-environment jsdom */

import { noop, omit } from 'lodash';
import Button from 'components/Button';
import { snapshot } from 'utils/jest';
import { StaticRouter } from 'react-router';

const testTheme = {
  active: 'ACTIVE_CLASS',
  ad: 'AD_TAG',
  button: 'BUTTON_CLASS',
  context: 'CONTEXT_TAG',
  disabled: 'DISABLED_CLASS',
  hoc: 'HOC_TAG',
};

describe('Matches snapshots', () => {
  test('when active', async () => {
    await snapshot((
      <Button
        active
        onClick={noop}
        theme={testTheme}
      >
        BUTTON
      </Button>
    ));
  });

  test('when disabled', async () => {
    await snapshot((
      <Button
        disabled
        onClick={noop}
        theme={testTheme}
      >
        BUTTON
      </Button>
    ));
    await snapshot((
      <Button
        disabled
        onClick={noop}
        theme={omit(testTheme, 'disabled')}
      >
        BUTTON
      </Button>
    ));
  });

  test('when rendered as link', async () => {
    await snapshot((
      <StaticRouter location="">
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
