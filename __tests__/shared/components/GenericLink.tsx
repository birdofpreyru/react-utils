/** @jest-environment jsdom */

import { Link } from 'react-router';

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
      onClick={onClick}
      className={className}
      type="button"
    >
      {JSON.stringify(props)}
    </button>
  );
};

test('Absolute link, starting with http://', () => {
  snapshot((
    <GenericLink
      routerLinkType={TestLink as unknown as LinkT}
      to="http://www.domain.com/test"
    >
      ABSOLUTE LINK
    </GenericLink>
  ));
});

test('Absolute link, starting with https://', () => {
  snapshot((
    <GenericLink
      onClick={() => {}}
      routerLinkType={TestLink as unknown as LinkT}
      to="https://www.domain.com/test"
    >
      ABSOLUTE LINK
    </GenericLink>
  ));
});

test('Relative link', () => {
  snapshot((
    <GenericLink
      routerLinkType={TestLink as unknown as LinkT}
      to="http/relative/link"
    >
      RELATIVE LINK
    </GenericLink>
  ));
});

test('Relative link, with `enforceA`', () => {
  snapshot((
    <GenericLink
      enforceA
      routerLinkType={TestLink as unknown as LinkT}
      to="/relative/link"
    >
      RELATIVE LINK
    </GenericLink>
  ));
});

test('Relative link, with `openNewTab`', () => {
  snapshot((
    <GenericLink
      openNewTab
      routerLinkType={TestLink as unknown as LinkT}
      to="relative/link"
    >
      RELATIVE LINL
    </GenericLink>
  ));
});

test('Anchor link', () => {
  snapshot((
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

  expect(clickHandler).toHaveBeenCalled();
  expect(window.scroll).toHaveBeenCalledTimes(1);
});
