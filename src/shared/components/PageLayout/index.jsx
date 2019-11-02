/**
 * Standard Page layout.
 */

import React from 'react';

import { PT, themed } from 'utils';

import baseTheme from './base-theme.scss';

function PageLayout({
  children,
  leftSidePanelContent,
  rightSidePanelContent,
  theme,
}) {
  return (
    <div className={theme.container}>
      <div className={[theme.sidePanel, theme.leftSidePanel].join(' ')}>
        {leftSidePanelContent}
      </div>
      <div className={theme.mainPanel}>
        {children}
      </div>
      <div className={[theme.sidePanel, theme.rightSidePanel].join(' ')}>
        {rightSidePanelContent}
      </div>
    </div>
  );
}

PageLayout.propTypes = {
  children: PT.node,
  leftSidePanelContent: PT.node,
  rightSidePanelContent: PT.node,
  theme: PT.exact({
    ad: PT.string,
    hoc: PT.string,
    context: PT.string,
    container: PT.string,
    leftSidePanel: PT.string,
    mainPanel: PT.string,
    rightSidePanel: PT.string,
    sidePanel: PT.string,
  }).isRequired,
};

PageLayout.defaultProps = {
  children: null,
  leftSidePanelContent: null,
  rightSidePanelContent: null,
};

export default themed('PageLayout', baseTheme)(PageLayout);
