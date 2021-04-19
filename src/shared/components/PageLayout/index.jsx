import PT from 'prop-types';

import { themed } from 'utils';

import baseTheme from './base-theme.scss';

/**
 * @category Components
 * @func PageLayout
 * @desc
 * ```jsx
 * import { PageLayout } from '@dr.pogodin/react-utils';
 * export default PageLayoutDemo() {
 *   return (
 *     <PageLayout>
 *       Page content.
 *     </PageLayout>
 *   );
 * }
 * ```
 * Simple and themeable page layout. It keeps the main content centered in
 * a column of limited width, which fills entire viewport on small screens
 * (under `$screen-md = 1024px` size). At larger screens the column keeps
 * `$screen-md` size, and it is centered at the page, surrounded by side
 * panels, where additional content can be displayed.
 *
 * **Children:** Component children are rendered as the content of main panel.
 * @param {object} [props] Component properties.
 * @param {Node} [props.leftSidePanelContent] The content for left side panel.
 * @param {Node} [props.rightSidePanelContent] The content for right side panel.
 * @param {PageLayoutTheme} [props.theme] _Ad hoc_ theme.
 * @param {...any} [props....]
 * [Other theming properties](https://www.npmjs.com/package/@dr.pogodin/react-themes#themed-component-properties)
 */
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

/**
 * @category Components
 * @typedef PageLayoutTheme {@link PageLayout} component theme.
 * @prop {string} [container] Class for the root container of page layout.
 * @prop {string} [mainPanel] Class for the main content panel.
 * @prop {string} [sidePanel] Class for each side panel.
 * @prop {string} [leftSidePanel] Class for the left side panel (in addition to
 * `.sidePanel`, if also provided).
 * @prop {string} [rightSidePanel] Class for the right side panel (in addition
 * to `.sidePanel`, if also provided).
 */
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
