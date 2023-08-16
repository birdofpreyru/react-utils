/* global window */

import PT from 'prop-types';
import { useEffect, useRef, useState } from 'react';

import { themed } from 'utils';

import Tooltip, { PLACEMENTS } from './Tooltip';

import defaultTheme from './default-theme.scss';

/**
 * Implements a simple to use and themeable tooltip component, _e.g._
 * ```js
 * <WithTooltip tip="This is example tooltip.">
 *   <p>Hover to see the tooltip.</p>
 * </WithTooltip>
 * ```
 * **Children:** Children are rendered in the place of `<WithTooltip>`,
 * and when hovered the tooltip is shown. By default the wrapper itself is
 * `<div>` block with `display: inline-block`.
 * @param {object} props Component properties.
 * @param {React.node} props.tip &ndash; Anything React is able to render,
 * _e.g._ a tooltip text. This will be the tooltip content.
 * @param {WithTooltipTheme} props.theme _Ad hoc_ theme.
 */
function Wrapper({
  children,
  placement,
  tip,
  theme,
}) {
  const { current: heap } = useRef({
    lastCursorX: 0,
    lastCursorY: 0,
  });
  const tooltipRef = useRef();
  const wrapperRef = useRef();
  const [showTooltip, setShowTooltip] = useState(false);

  const updatePortalPosition = (cursorX, cursorY) => {
    if (!showTooltip) {
      heap.lastCursorX = cursorX;
      heap.lastCursorY = cursorY;
      setShowTooltip(true);
    } else {
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
          cursorX + window.scrollX,
          cursorY + window.scrollY,
          placement,
          wrapperRef.current,
        );
      }
    }
  };

  useEffect(() => {
    if (showTooltip && tip !== null) {
      // This is necessary to ensure that even when a single mouse event
      // arrives to a tool-tipped component, the tooltip is correctly positioned
      // once opened (because similar call above does not have effect until
      // the tooltip is fully mounted, and that is delayed to future rendering
      // cycle due to the implementation).
      if (tooltipRef.current) {
        tooltipRef.current.pointTo(
          heap.lastCursorX + window.scrollX,
          heap.lastCursorY + window.scrollY,
          placement,
          wrapperRef.current,
        );
      }

      const listener = () => setShowTooltip(false);
      window.addEventListener('scroll', listener);
      return () => window.removeEventListener('scroll', listener);
    }
    return undefined;
  }, [
    heap.lastCursorX,
    heap.lastCursorY,
    placement,
    showTooltip,
    tip,
  ]);

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
