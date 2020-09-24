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

const ThemedPageLayout = themed('PageLayout', [
  'container',
  'leftSidePanel',
  'mainPanel',
  'rightSidePanel',
  'sidePanel',
], baseTheme)(PageLayout);

PageLayout.propTypes = {
  children: PT.node,
  leftSidePanelContent: PT.node,
  rightSidePanelContent: PT.node,
  theme: ThemedPageLayout.themeType.isRequired,
};

PageLayout.defaultProps = {
  children: null,
  leftSidePanelContent: null,
  rightSidePanelContent: null,
};

export default ThemedPageLayout;
