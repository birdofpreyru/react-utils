/**
 * The actual tooltip component. It is rendered outside the regular document
 * hierarchy, and with sub-components managed without React to achieve the best
 * performance during animation.
 */
/* global document, window */

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { createPortal } from 'react-dom';

import PT from 'prop-types';

/* Valid placements of the rendered tooltip. They will be overriden when
 * necessary to fit the tooltip within the viewport. */
export const PLACEMENTS = {
  ABOVE_CURSOR: 'ABOVE_CURSOR',
  ABOVE_ELEMENT: 'ABOVE_ELEMENT',
  BELOW_CURSOR: 'BELOW_CURSOR',
  BELOW_ELEMENT: 'BELOW_ELEMENT',
};

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

/**
 * Creates tooltip components.
 * @param {object} theme Themes to use for tooltip container, arrow,
 *  and content.
 * @return {object} Object with DOM references to the container components:
 *  container, arrow, content.
 */
function createTooltipComponents(theme) {
  const arrow = document.createElement('div');
  if (theme.arrow) arrow.setAttribute('class', theme.arrow);

  const content = document.createElement('div');
  if (theme.content) content.setAttribute('class', theme.content);

  const container = document.createElement('div');
  if (theme.container) container.setAttribute('class', theme.container);

  container.appendChild(arrow);
  container.appendChild(content);
  document.body.appendChild(container);

  return { container, arrow, content };
}

/**
 * Generates bounding client rectangles for tooltip components.
 * @param {object} tooltip DOM references to the tooltip components.
 * @param {object} tooltip.arrow
 * @param {object} tooltip.container
 * @return {{ arrow: object, container}} Object holding tooltip rectangles in
 *  two fields.
 */
function calcTooltipRects(tooltip) {
  return {
    arrow: tooltip.arrow.getBoundingClientRect(),
    container: tooltip.container.getBoundingClientRect(),
  };
}

/**
 * Calculates the document viewport size.
 * @return {{x, y, width, height}}
 */
function calcViewportRect() {
  const { pageXOffset, pageYOffset } = window;
  const { documentElement: { clientHeight, clientWidth } } = document;
  return {
    left: pageXOffset,
    right: pageXOffset + clientWidth,
    top: pageYOffset,
    bottom: pageYOffset + clientHeight,
  };
}

/**
 * Calculates tooltip and arrow positions for the placement just above
 * the cursor.
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
function calcPositionAboveXY(x, y, tooltipRects) {
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

/*
const HIT = {
  NONE: false,
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
  TOP: 'TOP',
  BOTTOM: 'BOTTOM',
};
*/

/**
 * Checks whether
 * @param {object} pos
 * @param {object} tooltipRects
 * @param {object} viewportRect
 * @return {HIT}
 */
/*
function checkViewportFit(pos, tooltipRects, viewportRect) {
  const { containerX, containerY } = pos;
  if (containerX < viewportRect.left + 6) return HIT.LEFT;
  if (containerX > viewportRect.right - 6) return HIT.RIGHT;
  return HIT.NONE;
}
*/

/**
 * Shifts tooltip horizontally to fit into the viewport, while keeping
 * the arrow pointed to the XY point.
 * @param {number} x
 * @param {number} y
 * @param {object} pos
 * @param {number} pageXOffset
 * @param {number} pageXWidth
 */
/*
function xPageFitCorrection(x, y, pos, pageXOffset, pageXWidth) {
  if (pos.containerX < pageXOffset + 6) {
    pos.containerX = pageXOffset + 6;
    pos.arrowX = Math.max(6, pageX - containerX - arrowRect.width / 2);
  } else {
    const maxX = pageXOffset + docRect.width - containerRect.width - 6;
    if (containerX > maxX) {
      containerX = maxX;
      arrowX = Math.min(
        containerRect.width - 6,
        pageX - containerX - arrowRect.width / 2,
      );
    }
  }
}
*/

/**
 * Sets positions of tooltip components to point the tooltip to the specified
 * page point.
 * @param {number} pageX
 * @param {number} pageY
 * @param {PLACEMENTS} placement
 * @param {object} element DOM reference to the element wrapped by the tooltip.
 * @param {object} tooltip
 * @param {object} tooltip.arrow DOM reference to the tooltip arrow.
 * @param {object} tooltip.container DOM reference to the tooltip container.
 */
function setComponentPositions(
  pageX,
  pageY,
  placement,
  element,
  tooltip,
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
const Tooltip = forwardRef(({ children, theme }, ref) => {
  const [components, setComponents] = useState(null);

  const pointTo = (pageX, pageY, placement, element) => components
    && setComponentPositions(pageX, pageY, placement, element, components);
  useImperativeHandle(ref, () => ({ pointTo }));

  /* Inits and destroys tooltip components. */
  useEffect(() => {
    const x = createTooltipComponents(theme);
    setComponents(x);
    return () => {
      document.body.removeChild(x.container);
      setComponents(null);
    };
  }, []);

  return components ? createPortal(children, components.content) : null;
});

Tooltip.propTypes = {
  children: PT.node,
  theme: PT.shape().isRequired,
};

Tooltip.defaultProps = {
  children: null,
};

export default Tooltip;
