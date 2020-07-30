/**
 * A wrapper component implementing tooltip.
 */
/* global window */

import React from 'react';

import { hooks, PT, themed } from 'utils';

import Tooltip, { PLACEMENTS } from './Tooltip';

import defaultTheme from './default-theme.scss';

function Wrapper({
  children,
  placement,
  tip,
  theme,
}) {
  const tooltipRef = hooks.useRef();
  const wrapperRef = hooks.useRef();
  const [showTooltip, setShowTooltip] = hooks.useState(false);

  const updatePortalPosition = (cursorX, cursorY) => {
    if (!showTooltip) setShowTooltip(true);
    else {
      const wrapperRect = wrapperRef.current.getBoundingClientRect();
      if (
        cursorX < wrapperRect.left
        || cursorX > wrapperRect.right
        || cursorY < wrapperRect.top
        || cursorY > wrapperRect.bottom
      ) {
        setShowTooltip(false);
      } else if (tooltipRef.current) {
        tooltipRef.current.pointTo(
          cursorX + window.pageXOffset,
          cursorY + window.pageYOffset,
          placement,
          wrapperRef.current,
        );
      }
    }
  };

  hooks.useEffect(() => {
    if (showTooltip && tip !== null) {
      const listener = () => setShowTooltip(false);
      window.addEventListener('scroll', listener);
      return () => window.removeEventListener('scroll', listener);
    }
    return undefined;
  }, [showTooltip, tip]);

  return (
    <div
      className={theme.wrapper}
      onMouseLeave={() => setShowTooltip(false)}
      onMouseMove={(e) => updatePortalPosition(e.clientX, e.clientY)}
      ref={wrapperRef}
    >
      {
        showTooltip && tip !== null ? (
          <Tooltip ref={tooltipRef} theme={theme}>{tip}</Tooltip>
        ) : null
      }
      {children}
    </div>
  );
}

const ThemedWrapper = themed(
  'WithTooltip',
  [
    'appearance',
    'arrow',
    'container',
    'content',
    'wrapper',
  ],
  defaultTheme,
)(Wrapper);

ThemedWrapper.PLACEMENTS = PLACEMENTS;

Wrapper.propTypes = {
  children: PT.node,
  placement: PT.oneOf(Object.values(PLACEMENTS)),
  theme: ThemedWrapper.themeType.isRequired,
  tip: PT.node,
};

Wrapper.defaultProps = {
  children: null,
  placement: PLACEMENTS.ABOVE_CURSOR,
  tip: null,
};

export default ThemedWrapper;
