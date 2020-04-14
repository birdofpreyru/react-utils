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
 * Sets positions of tooltip components to point the tooltip to the specified
 * page point.
 * @param {number} pageX
 * @param {number} pageY
 * @param {object} components
 * @param {object} components.arrow
 * @param {object} components.container
 */
function setComponentPositions(pageX, pageY, { arrow, container }) {
  const arrowRect = arrow.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();
  const docRect = document.body.getBoundingClientRect();
  const { pageXOffset, pageYOffset } = window;

  /* Default container coords: tooltip at the top. */
  let containerX = pageX - containerRect.width / 2;
  let containerY = pageY - containerRect.height - arrowRect.height / 1.5;

  let arrowX = 0.5 * (containerRect.width - arrowRect.width);
  let arrowY = containerRect.height;

  let arrowStyle;

  if (containerX < pageXOffset + 6) {
    containerX = pageXOffset + 6;
    arrowX = Math.max(6, pageX - containerX - arrowRect.width / 2);
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

  /* If tooltip has not enough space on top - make it bottom tooltip. */
  if (containerY < pageYOffset) {
    containerY += containerRect.height + 2 * arrowRect.height;
    arrowY -= containerRect.height + arrowRect.height;
    arrowStyle = ARROW_STYLE_UP;
  } else {
    arrowStyle = ARROW_STYLE_DOWN;
  }

  const containerStyle = `left:${containerX}px;top:${containerY}px`;
  container.setAttribute('style', containerStyle);

  arrowStyle = `${arrowStyle};left:${arrowX}px;top:${arrowY}px`;
  arrow.setAttribute('style', arrowStyle);
}

/* The Tooltip component itself. */
const Tooltip = forwardRef(({ children, theme }, ref) => {
  const [components, setComponents] = useState(null);

  const pointTo = (pageX, pageY) => components
    && setComponentPositions(pageX, pageY, components);
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
