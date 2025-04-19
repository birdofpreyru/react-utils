/** @jest-environment jsdom */

import type { Link } from 'react-router';

import UserEvents from '@testing-library/user-event';

import GenericLink from 'components/GenericLink';
import { mount, snapshot } from 'utils/jest';

type LinkT = typeof Link;

const TestLink: React.FunctionComponent<{
  className?: string;
  onClick: () => void;
}> = (props) => {
  const { className, onClick } = props;
  return (
    <button
      className={className}
      onClick={onClick}
      type="button"
    >
      {JSON.stringify(props)}
    </button>
  );
};

test('Absolute link, starting with http://', async () => {
  await snapshot((
    <GenericLink
      routerLinkType={TestLink as unknown as LinkT}
      to="http://www.domain.com/test"
    >
      ABSOLUTE LINK
    </GenericLink>
  ));
});

test('Absolute link, starting with https://', async () => {
  await snapshot((
    <GenericLink
      onClick={() => undefined}
      routerLinkType={TestLink as unknown as LinkT}
      to="https://www.domain.com/test"
    >
      ABSOLUTE LINK
    </GenericLink>
  ));
});

test('Relative link', async () => {
  await snapshot((
    <GenericLink
      routerLinkType={TestLink as unknown as LinkT}
      to="http/relative/link"
    >
      RELATIVE LINK
    </GenericLink>
  ));
});

test('Relative link, with `enforceA`', async () => {
  await snapshot((
    <GenericLink
      enforceA
      routerLinkType={TestLink as unknown as LinkT}
      to="/relative/link"
    >
      RELATIVE LINK
    </GenericLink>
  ));
});

test('Relative link, with `openNewTab`', async () => {
  await snapshot((
    <GenericLink
      openNewTab
      routerLinkType={TestLink as unknown as LinkT}
      to="relative/link"
    >
      RELATIVE LINL
    </GenericLink>
  ));
});

test('Anchor link', async () => {
  await snapshot((
    <GenericLink
      routerLinkType={TestLink as unknown as LinkT}
      to="#anchor"
    >
      ANCHOR LINK
    </GenericLink>
  ));
});

test('onClick(..) callback in custom <Link>', async () => {
  const user = UserEvents.setup();

  // TODO: Can't be just spyOn(), as JSDom does not provide .scroll() function
  // on `window` interface... check, if we also can mock it by .spyOn()?
  // eslint-disable-next-line jest/prefer-spy-on
  window.scroll = jest.fn();

  const clickHandler = jest.fn();
  const doc = mount((
    <GenericLink
      className="LINK"
      onClick={clickHandler}
      routerLinkType={TestLink as unknown as LinkT}
      to="SOME/TEST/URL"
    >
      LINK
    </GenericLink>
  ));

  const link = doc.querySelector('.LINK')!;
  await user.click(link);

  expect(clickHandler).toHaveBeenCalledTimes(1);
  expect(window.scroll).toHaveBeenCalledTimes(1);
});
