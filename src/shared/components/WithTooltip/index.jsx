/**
 * A wrapper component implementing tooltip.
 */
/* global document, window */

import React from 'react';
import ReactDom from 'react-dom';

import { hooks, PT, themed } from 'utils';

import defaultTheme from './default-theme.scss';

function Tooltip({
  children,
  theme,
}) {
  return (
    <>
      {children}
      <div className={theme.arrow} />
    </>
  );
}

Tooltip.propTypes = {
  children: PT.node,
  theme: PT.shape({
    arrow: PT.string.isRequired,
  }).isRequired,
};

Tooltip.defaultProps = {
  children: null,
};

function Wrapper({
  children,
  tip,
  theme,
}) {
  const { current: refs } = hooks.useRef({
    arrow: null,
    cursorX: 0,
    cursorY: 0,
    portal: null,
    wrapper: null,
  });

  const [portal, setPortal] = hooks.useState(null);

  const createTooltip = () => {
    if (!refs.portal) {
      const p = document.createElement('div');
      p.setAttribute('class', theme.tooltip);
      document.body.appendChild(p);
      refs.portal = p;
      setPortal(p);
    }
  };

  const destroyTooltip = () => {
    if (refs.portal) {
      document.body.removeChild(refs.portal);
      refs.portal = null;
      refs.arrow = null;
      setPortal(null);
    }
  };

  const updatePortalPosition = () => {
    if (!portal) createTooltip();
    else {
      const wrapperRect = refs.wrapper.getBoundingClientRect();
      if (
        refs.cursorClientX < wrapperRect.left
        || refs.cursorClientX > wrapperRect.right
        || refs.cursorClientY < wrapperRect.top
        || refs.cursorClientY > wrapperRect.bottom
      ) {
        destroyTooltip();
      } else {
        /* TODO: Some refactoring may be good here. */
        if (!refs.arrow) {
          const classNames = theme.arrow.split(' ').filter((item) => !!item);
          refs.arrow = portal.querySelector(`.${classNames.join('.')}`);
        }
        const arrowRect = refs.arrow.getBoundingClientRect();
        const portalRect = portal.getBoundingClientRect();
        let x = refs.cursorPageX - portalRect.width / 2;
        let y = refs.cursorPageY - portalRect.height - arrowRect.height / 1.5;

        let arrowStyle;
        let arrowX = portalRect.width / 2 - arrowRect.width / 2;

        if (x < window.pageXOffset) {
          x = window.pageXOffset + 6;
          arrowX = refs.cursorClientX - portalRect.left - arrowRect.width / 2;
        } else if (
          x + portalRect.width > window.pageXOffset + document.body.clientWidth
        ) {
          x = window.pageXOffset + document.body.clientWidth - portalRect.width - 6;
          arrowX = refs.cursorClientX - portalRect.left - arrowRect.width / 2;
        }
        if (arrowX > portalRect.width - arrowRect.width - 3) {
          arrowX = portalRect.width - arrowRect.width - 3;
        } else if (arrowX < 3) {
          arrowX = 3;
        }

        if (y < window.pageYOffset) {
          y += 2 * portalRect.height + arrowRect.height;
          arrowStyle = [
            'border-top-color:transparent',
            'border-left-color:transparent',
            'border-right-color:transparent',
            `left:${arrowX}px`,
            `top:${-arrowRect.height}px`,
          ].join(';');
        } else {
          arrowStyle = [
            'border-bottom-color:transparent',
            'border-left-color:transparent',
            'border-right-color:transparent',
            `left:${arrowX}px`,
          ].join(';');
        }

        refs.arrow.setAttribute('style', arrowStyle);
        portal.setAttribute('style', `left:${x}px;top:${y}px`);
      }
    }
  };

  hooks.useEffect(() => {
    const listener = () => {
      if (refs.portal) destroyTooltip();
    };
    window.addEventListener('scroll', listener);
    return () => {
      window.removeEventListener('scroll', listener);
    };
  }, []);

  hooks.useEffect(() => {
    if (portal) updatePortalPosition();
  }, [portal]);

  return (
    <div
      className={theme.wrapper}
      onMouseLeave={destroyTooltip}
      onMouseMove={(e) => {
        refs.cursorClientX = e.clientX;
        refs.cursorClientY = e.clientY;
        refs.cursorPageX = e.pageX;
        refs.cursorPageY = e.pageY;
        updatePortalPosition();
      }}
      ref={(node) => {
        refs.wrapper = node;
      }}
    >
      {
        portal ? ReactDom.createPortal((
          <Tooltip theme={theme}>{tip}</Tooltip>
        ), portal) : null
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
    'tooltip',
    'wrapper',
  ],
  defaultTheme,
)(Wrapper);

Wrapper.propTypes = {
  children: PT.node,
  theme: ThemedWrapper.themeType.isRequired,
  tip: PT.node,
};

Wrapper.defaultProps = {
  children: null,
  tip: null,
};

export default ThemedWrapper;
