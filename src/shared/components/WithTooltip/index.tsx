/* global window */

import {
  type FunctionComponent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';

import themed, { type Theme } from '@dr.pogodin/react-themes';

import Tooltip, {
  type ThemeKeysT as TooltipThemeKeysT,
  PLACEMENTS,
} from './Tooltip';

import defaultTheme from './default-theme.scss';

type PropsT = {
  children?: ReactNode;
  placement?: PLACEMENTS;
  tip?: ReactNode;
  theme: Theme<'wrapper' | TooltipThemeKeysT>;
};

type TooltipRefT = {
  pointTo: (
    x: number,
    y: number,
    placement: PLACEMENTS,
    wrapperRef: HTMLDivElement,
  ) => void;
};

type HeapT = {
  lastCursorX: number;
  lastCursorY: number;
  triggeredByTouch: boolean;
  timerId?: NodeJS.Timeout;
};

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
 * @param tip &ndash; Anything React is able to render,
 * _e.g._ a tooltip text. This will be the tooltip content.
 * @param {WithTooltipTheme} props.theme _Ad hoc_ theme.
 */
const Wrapper: FunctionComponent<PropsT> = ({
  children,
  placement = PLACEMENTS.ABOVE_CURSOR,
  tip,
  theme,
}) => {
  const { current: heap } = useRef<HeapT>({
    lastCursorX: 0,
    lastCursorY: 0,
    triggeredByTouch: false,
    timerId: undefined,
  });
  const tooltipRef = useRef<TooltipRefT>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  const updatePortalPosition = (cursorX: number, cursorY: number) => {
    if (!showTooltip) {
      heap.lastCursorX = cursorX;
      heap.lastCursorY = cursorY;

      // If tooltip was triggered by a touch, we delay its opening by a bit,
      // to ensure it was not a touch-click - in the case of touch click we
      // want to do the click, rather than show the tooltip, and the delay
      // gives click handler a chance to abort the tooltip openning.
      if (heap.triggeredByTouch) {
        if (!heap.timerId) {
          heap.timerId = setTimeout(() => {
            heap.triggeredByTouch = false;
            heap.timerId = undefined;
            setShowTooltip(true);
          }, 300);
        }

      // Otherwise we can just open the tooltip right away.
      } else setShowTooltip(true);
    } else {
      const wrapperRect = wrapperRef.current!.getBoundingClientRect();
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
          placement!,
          wrapperRef.current!,
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
          placement!,
          wrapperRef.current!,
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
      onClick={() => {
        if (heap.timerId) {
          clearTimeout(heap.timerId);
          heap.timerId = undefined;
          heap.triggeredByTouch = false;
        }
      }}
      onTouchStart={() => {
        heap.triggeredByTouch = true;
      }}
      ref={wrapperRef}
      role="presentation"
    >
      {
        showTooltip && tip !== null ? (
          <Tooltip ref={tooltipRef} theme={theme}>{tip}</Tooltip>
        ) : null
      }
      {children}
    </div>
  );
};

const ThemedWrapper = themed(Wrapper, 'WithTooltip', defaultTheme);

type ExportT = typeof ThemedWrapper & {
  PLACEMENTS: typeof PLACEMENTS;
};

const e: ExportT = ThemedWrapper as ExportT;

e.PLACEMENTS = PLACEMENTS;

export default e;
