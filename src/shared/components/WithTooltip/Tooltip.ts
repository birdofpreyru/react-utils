/**
 * The actual tooltip component. It is rendered outside the regular document
 * hierarchy, and with sub-components managed without React to achieve the best
 * performance during animation.
 */

import {
  type FunctionComponent,
  type ReactNode,
  type RefObject,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

import { createPortal } from 'react-dom';

import type { Theme } from '@dr.pogodin/react-themes';

/**
 * Valid placements of the rendered tooltip. They will be overriden when
 * necessary to fit the tooltip within the viewport.
 */
export enum PLACEMENTS {
  ABOVE_CURSOR = 'ABOVE_CURSOR',
  ABOVE_ELEMENT = 'ABOVE_ELEMENT',
  BELOW_CURSOR = 'BELOW_CURSOR',
  BELOW_ELEMENT = 'BELOW_ELEMENT',
}

const ARROW_STYLE_DOWN = [
  'border-bottom-color:transparent',
  'border-left-color:transparent',
  'border-right-color:transparent',
].join(';');

const ARROW_STYLE_UP = [
  'border-top-color:transparent',
  'border-left-color:transparent',
  'border-right-color:transparent',
].join(';');

type ComponentsT = {
  container: HTMLDivElement;
  arrow: HTMLDivElement;
  content: HTMLDivElement;
};

type HeapT = {
  lastElement?: HTMLElement;
  lastPageX: number;
  lastPageY: number;
  lastPlacement?: PLACEMENTS | undefined;
};

export type ThemeKeysT = 'appearance' | 'arrow' | 'content' | 'container';

type TooltipThemeT = Theme<ThemeKeysT>;

/**
 * Creates tooltip components.
 * @ignore
 * @param {object} theme Themes to use for tooltip container, arrow,
 *  and content.
 * @return {object} Object with DOM references to the container components:
 *  container, arrow, content.
 */
function createTooltipComponents(theme: TooltipThemeT): ComponentsT {
  const arrow = document.createElement('div');
  if (theme.arrow) arrow.setAttribute('class', theme.arrow);

  const content = document.createElement('div');
  if (theme.content) content.setAttribute('class', theme.content);

  const container = document.createElement('div');
  if (theme.container) container.setAttribute('class', theme.container);

  container.appendChild(arrow);
  container.appendChild(content);
  document.body.appendChild(container);

  return { arrow, container, content };
}

type TooltipRectsT = {
  arrow: DOMRect;
  container: DOMRect;
};

/**
 * Generates bounding client rectangles for tooltip components.
 * @ignore
 * @param tooltip DOM references to the tooltip components.
 * @param tooltip.arrow
 * @param tooltip.container
 * @return Object holding tooltip rectangles in
 *  two fields.
 */
function calcTooltipRects(tooltip: ComponentsT): TooltipRectsT {
  return {
    arrow: tooltip.arrow.getBoundingClientRect(),
    container: tooltip.container.getBoundingClientRect(),
  };
}

/**
 * Calculates the document viewport size.
 * @ignore
 * @return {{x, y, width, height}}
 */
function calcViewportRect() {
  const { scrollX, scrollY } = window;
  const { documentElement: { clientHeight, clientWidth } } = document;
  return {
    bottom: scrollY + clientHeight,
    left: scrollX,
    right: scrollX + clientWidth,
    top: scrollY,
  };
}

/**
 * Calculates tooltip and arrow positions for the placement just above
 * the cursor.
 * @ignore
 * @param {number} x Cursor page-x position.
 * @param {number} y Cursor page-y position.
 * @param {object} tooltipRects Bounding client rectangles of tooltip parts.
 * @param {object} tooltipRects.arrow
 * @param {object} tooltipRects.container
 * @return {object} Contains the following fields:
 *  - {number} arrowX
 *  - {number} arrowY
 *  - {number} containerX
 *  - {number} containerY
 *  - {string} baseArrowStyle
 */
function calcPositionAboveXY(
  x: number,
  y: number,
  tooltipRects: TooltipRectsT,
) {
  const { arrow, container } = tooltipRects;
  return {
    arrowX: 0.5 * (container.width - arrow.width),
    arrowY: container.height,
    containerX: x - container.width / 2,
    containerY: y - container.height - arrow.height / 1.5,

    // TODO: Instead of already setting the base style here, we should
    // introduce a set of constants for arrow directions, which will help
    // to do checks dependant on the arrow direction.
    baseArrowStyle: ARROW_STYLE_DOWN,
  };
}

// const HIT = {
//   NONE: false,
//   LEFT: 'LEFT',
//   RIGHT: 'RIGHT',
//   TOP: 'TOP',
//   BOTTOM: 'BOTTOM',
// };

/**
 * Checks whether
 * @param {object} pos
 * @param {object} tooltipRects
 * @param {object} viewportRect
 * @return {HIT}
 */
// function checkViewportFit(pos, tooltipRects, viewportRect) {
//   const { containerX, containerY } = pos;
//   if (containerX < viewportRect.left + 6) return HIT.LEFT;
//   if (containerX > viewportRect.right - 6) return HIT.RIGHT;
//   return HIT.NONE;
// }

/**
 * Shifts tooltip horizontally to fit into the viewport, while keeping
 * the arrow pointed to the XY point.
 * @param {number} x
 * @param {number} y
 * @param {object} pos
 * @param {number} pageXOffset
 * @param {number} pageXWidth
 */
// function xPageFitCorrection(x, y, pos, pageXOffset, pageXWidth) {
//   if (pos.containerX < pageXOffset + 6) {
//     pos.containerX = pageXOffset + 6;
//     pos.arrowX = Math.max(6, pageX - containerX - arrowRect.width / 2);
//   } else {
//     const maxX = pageXOffset + docRect.width - containerRect.width - 6;
//     if (containerX > maxX) {
//       containerX = maxX;
//       arrowX = Math.min(
//         containerRect.width - 6,
//         pageX - containerX - arrowRect.width / 2,
//       );
//     }
//   }
// }

/**
 * Sets positions of tooltip components to point the tooltip to the specified
 * page point.
 * @ignore
 * @param pageX
 * @param pageY
 * @param placement
 * @param element DOM reference to the element wrapped by the tooltip.
 * @param tooltip
 * @param tooltip.arrow DOM reference to the tooltip arrow.
 * @param tooltip.container DOM reference to the tooltip container.
 */
function setComponentPositions(
  pageX: number,
  pageY: number,
  placement: PLACEMENTS | undefined,
  element: HTMLElement | undefined,
  tooltip: ComponentsT,
) {
  const tooltipRects = calcTooltipRects(tooltip);
  const viewportRect = calcViewportRect();

  /* Default container coords: tooltip at the top. */
  const pos = calcPositionAboveXY(pageX, pageY, tooltipRects);

  if (pos.containerX < viewportRect.left + 6) {
    pos.containerX = viewportRect.left + 6;
    pos.arrowX = Math.max(
      6,
      pageX - pos.containerX - tooltipRects.arrow.width / 2,
    );
  } else {
    const maxX = viewportRect.right - 6 - tooltipRects.container.width;
    if (pos.containerX > maxX) {
      pos.containerX = maxX;
      pos.arrowX = Math.min(
        tooltipRects.container.width - 6,
        pageX - pos.containerX - tooltipRects.arrow.width / 2,
      );
    }
  }

  /* If tooltip has not enough space on top - make it bottom tooltip. */
  if (pos.containerY < viewportRect.top + 6) {
    pos.containerY += tooltipRects.container.height
      + 2 * tooltipRects.arrow.height;
    pos.arrowY -= tooltipRects.container.height
      + tooltipRects.arrow.height;
    pos.baseArrowStyle = ARROW_STYLE_UP;
  }

  const containerStyle = `left:${pos.containerX}px;top:${pos.containerY}px`;
  tooltip.container.setAttribute('style', containerStyle);

  const arrowStyle = `${pos.baseArrowStyle};left:${pos.arrowX}px;top:${pos.arrowY}px`;
  tooltip.arrow.setAttribute('style', arrowStyle);
}

/* The Tooltip component itself. */
const Tooltip: FunctionComponent<{
  children?: ReactNode;
  ref?: RefObject<unknown>;
  theme: TooltipThemeT;
}> = ({ children, ref, theme }) => {
  // NOTE: The way it has to be implemented, for clean mounting and unmounting
  // at the client side, the <Tooltip> is fully mounted into DOM in the next
  // rendering cycles, and only then it can be correctly measured and positioned.
  // Thus, when we create the <Tooltip> we have to record its target positioning
  // details, and then apply them when it is created.

  const { current: heap } = useRef<HeapT>({
    lastElement: undefined,
    lastPageX: 0,
    lastPageY: 0,
    lastPlacement: undefined,
  });

  const [components, setComponents] = useState<ComponentsT | null>(null);

  const pointTo = (
    pageX: number,
    pageY: number,
    placement: PLACEMENTS,
    element: HTMLElement,
  ) => {
    heap.lastElement = element;
    heap.lastPageX = pageX;
    heap.lastPageY = pageY;
    heap.lastPlacement = placement;

    if (components) {
      setComponentPositions(pageX, pageY, placement, element, components);
    }
  };
  useImperativeHandle(ref, () => ({ pointTo }));

  /* Inits and destroys tooltip components. */
  useEffect(() => {
    const x = createTooltipComponents(theme);
    setComponents(x);
    return () => {
      document.body.removeChild(x.container);
      setComponents(null);
    };
  }, [theme]);

  useEffect(() => {
    if (components) {
      setComponentPositions(
        heap.lastPageX,
        heap.lastPageY,
        heap.lastPlacement,
        heap.lastElement,
        components,
      );
    }
  }, [
    components,
    // BEWARE: Careful about these dependencies - they are updated when mouse
    // is moved over the tool-tipped element, thus potentially may cause
    // unnecessary firing of this effect on each mouse event. It does not
    // happen now just because the mouse movements themselves are not causing
    // the component re-rendering, thus dependencies of this effect are not
    // really re-evaluated.
    heap.lastPageX,
    heap.lastPageY,
    heap.lastPlacement,
    heap.lastElement,
  ]);

  return components ? createPortal(children, components.content) : null;
};

export default Tooltip;
