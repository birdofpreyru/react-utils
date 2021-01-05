import PT from 'prop-types';
import themed from '@dr.pogodin/react-themes';

import defaultTheme from './theme.scss';

function Throbber({
  theme,
}) {
  return (
    <div className={theme.container} styleName="container">
      <div className={theme.circle} styleName="circle" />
      <div className={theme.circle} styleName="circle" />
      <div className={theme.circle} styleName="circle" />
    </div>
  );
}

Throbber.defaultProps = {
  theme: {},
};

Throbber.propTypes = {
  theme: PT.shape({
    container: PT.string,
    circle: PT.string,
  }),
};

export default themed('Throbber', [
  'circle',
  'container',
], defaultTheme)(Throbber);
