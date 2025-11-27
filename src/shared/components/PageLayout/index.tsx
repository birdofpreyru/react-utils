import type { FunctionComponent, ReactNode } from 'react';

import { type Theme, useTheme } from '@dr.pogodin/react-themes';

import baseTheme from './base-theme.scss';

type ThemeKeyT = 'container' | 'leftSidePanel' | 'mainPanel' | 'rightSidePanel'
  | 'sidePanel';

type PropsT = {
  children?: ReactNode;
  leftSidePanelContent?: ReactNode;
  rightSidePanelContent?: ReactNode;
  theme?: Theme<ThemeKeyT>;
};

/**
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
const PageLayout: FunctionComponent<PropsT> = ({
  children,
  leftSidePanelContent,
  rightSidePanelContent,
  theme,
}) => {
  const composed = useTheme('PageLayout', baseTheme, theme);
  return (
    <div className={composed.container}>
      <div className={[composed.sidePanel, composed.leftSidePanel].join(' ')}>
        {leftSidePanelContent}
      </div>
      <div className={composed.mainPanel}>
        {children}
      </div>
      <div className={[composed.sidePanel, composed.rightSidePanel].join(' ')}>
        {rightSidePanelContent}
      </div>
    </div>
  );
};

export default PageLayout;
