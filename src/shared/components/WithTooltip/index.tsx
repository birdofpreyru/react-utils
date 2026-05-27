/* global window */

import {
  type FunctionComponent,
  type HTMLAttributes,
  type ReactNode,
  type RefObject,
  useEffect,
  useRef,
  useState,
} from 'react';

import { type Theme, useTheme } from '@dr.pogodin/react-themes';

import Tooltip, {
  PLACEMENTS,
  type ThemeKeysT as TooltipThemeKeysT,
} from './Tooltip';

import defaultTheme from './default-theme.scss';

type PropsT = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
  placement?: PLACEMENTS;
  ref?: RefObject<HTMLDivElement | null>;
  theme?: Theme<'wrapper' | TooltipThemeKeysT>;
  tip?: ReactNode;
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
  ignoreMouseMove?: boolean;
  lastCursorX: number;
  lastCursorY: number;
  timerId?: NodeJS.Timeout;
  triggeredByTouch: boolean;
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
const WithTooltip: FunctionComponent<PropsT> = ({
  children,
  className: classNameProp,
  onClick,
  onContextMenu,
  onMouseLeave,
  onMouseMove,
  onTouchStart,
  placement = PLACEMENTS.ABOVE_CURSOR,
  ref,
  style,
  theme,
  tip,
  ...htmlAttributes
}) => {
  const custom = useTheme('WithTooltip', defaultTheme, theme);

  const [heap, setHeap] = useState<HeapT>({
    lastCursorX: 0,
    lastCursorY: 0,
    timerId: undefined,
    triggeredByTouch: false,
  });

  const tooltipRef = useRef<TooltipRefT>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  const updatePortalPosition = (cursorX: number, cursorY: number) => {
    if (showTooltip) {
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
          placement,
          wrapperRef.current!,
        );
      }
    } else {
      setHeap((prev) => {
        const res: HeapT = {
          ...prev,
          lastCursorX: cursorX,
          lastCursorY: cursorY,
        };

        // If tooltip was triggered by a touch, we delay its opening by a bit,
        // to ensure it was not a touch-click - in the case of touch click we
        // want to do the click, rather than show the tooltip, and the delay
        // gives click handler a chance to abort the tooltip openning.
        if (res.triggeredByTouch) {
          res.timerId ??= setTimeout(() => {
            setHeap((p) => ({
              ...p,
              timerId: undefined,
              triggeredByTouch: false,
            }));

            setShowTooltip(true);
          }, 300);

        // Otherwise we can just open the tooltip right away.
        } else setShowTooltip(true);

        return res;
      });
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
        setHeap((prev) => {
          tooltipRef.current?.pointTo(
            prev.lastCursorX + window.scrollX,
            prev.lastCursorY + window.scrollY,
            placement,
            wrapperRef.current!,
          );
          return prev;
        });
      }

      const listener = () => {
        setShowTooltip(false);
      };
      window.addEventListener('scroll', listener);
      return () => {
        window.removeEventListener('scroll', listener);
      };
    }
    return undefined;
  }, [
    placement,
    showTooltip,
    tip,
  ]);

  let container = custom.wrapper;
  if (classNameProp) container += ` ${classNameProp}`;

  useEffect(() => {
    const listener = () => {
      setShowTooltip(false);
      heap.triggeredByTouch = false;
      if (heap.timerId) {
        clearTimeout(heap.timerId);
        heap.timerId = undefined;
        heap.triggeredByTouch = false;
      }
    };
    window.addEventListener('touchcancel', listener);
    window.addEventListener('touchend', listener);
    return () => {
      window.removeEventListener('touchcancel', listener);
      window.removeEventListener('touchend', listener);
    };
  }, [heap]);

  return (
    <div
      className={container}
      onClick={(e) => {
        if (heap.timerId) {
          clearTimeout(heap.timerId);

          setHeap({
            ...heap,
            timerId: undefined,
            triggeredByTouch: false,
          });
        }
        onClick?.(e);
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        onContextMenu?.(e);
      }}
      onMouseLeave={(e) => {
        setShowTooltip(false);
        onMouseLeave?.(e);
      }}
      onMouseMove={(e) => {
        // NOTE: Because on touch devices mouse move events are still fired
        // after touch is released, to emulate mouse clicks for old websites.
        // If we don't ignore it here, the tooltip will appear after the touch
        // is released.
        if (!heap.ignoreMouseMove) {
          updatePortalPosition(e.clientX, e.clientY);
        }
        onMouseMove?.(e);
      }}
      onTouchStart={(e) => {
        setHeap({
          ...heap,
          ignoreMouseMove: true,
          triggeredByTouch: true,
        });

        // TODO: I guess, it should be something more complex here,
        // to actually respond to the first / whatever touch we need.
        const touch = e.targetTouches.item(0);
        updatePortalPosition(touch.clientX, touch.clientY);

        onTouchStart?.(e);
      }}
      ref={(node) => {
        wrapperRef.current = node;

        // eslint-disable-next-line no-param-reassign
        if (ref) ref.current = node;
      }}
      role="presentation"
      style={style}

      // eslint-disable-next-line react/jsx-props-no-spreading
      {...htmlAttributes}
    >
      {
        showTooltip && tip !== null
          ? <Tooltip ref={tooltipRef} theme={custom}>{tip}</Tooltip>
          : null
      }
      {children}
    </div>
  );
};

type ExportT = {
  PLACEMENTS: typeof PLACEMENTS;
} & typeof WithTooltip;

const e: ExportT = WithTooltip as ExportT;

e.PLACEMENTS = PLACEMENTS;

export default e;
