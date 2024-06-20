/** @jest-environment jsdom */

import userEvent from '@testing-library/user-event';

import GenericLink from 'components/GenericLink';
import { mount, snapshot } from 'utils/jest';

const user = userEvent.setup();

function Link(props) {
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
}

test('Absolute link, starting with http://', () => {
  snapshot((
    <GenericLink
      routerLinkType={Link}
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
      routerLinkType={Link}
      to="https://www.domain.com/test"
    >
      ABSOLUTE LINK
    </GenericLink>
  ));
});

test('Relative link', () => {
  snapshot((
    <GenericLink
      routerLinkType={Link}
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
      routerLinkType={Link}
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
      routerLinkType={Link}
      to="relative/link"
    >
      RELATIVE LINL
    </GenericLink>
  ));
});

test('Anchor link', () => {
  snapshot((
    <GenericLink
      routerLinkType={Link}
      to="#anchor"
    >
      ANCHOR LINK
    </GenericLink>
  ));
});

test('onClick(..) callback in custom <Link>', async () => {
  window.scroll = jest.fn();
  const clickHandler = jest.fn();
  const doc = mount((
    <GenericLink
      className="LINK"
      onClick={clickHandler}
      routerLinkType={Link}
      to="SOME/TEST/URL"
    >
      LINK
    </GenericLink>
  ));
  const link = doc.querySelector('.LINK');
  await user.click(link);
  expect(clickHandler).toHaveBeenCalled();
  expect(window.scroll).toHaveBeenCalledTimes(1);
});
