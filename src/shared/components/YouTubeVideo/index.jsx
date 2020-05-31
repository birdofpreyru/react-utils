/**
 * Renders a YouTube video into a page. Not that it is difficult to embed
 * a YouTube video, but this component makes it even easier, and smooths some
 * corners: like drawing a gray placeholder with a loading indicator while your
 * network communicates with YouTube to get the actual video.
 *
 * Probably, it works out of the box for other video hosting platforms, and
 * also for embeding of other similar objects, but to be on the safe side, lets
 * call it YouTubeVideo for now.
 */

import PT from 'prop-types';
import qs from 'qs';
import React from 'react';
import ScalableRect from 'components/ScalableRect';
import themed from '@dr.pogodin/react-themes';
import Throbber from 'components/Throbber';

import baseTheme from './base.scss';
import throbberTheme from './throbber.scss';

function YouTubeVideo({
  autoplay,
  src,
  theme,
  title,
}) {
  let [url, query] = src.split('?');
  query = query ? qs.parse(query) : {};

  const videoId = query.v || url.match(/\/(\w*)$/)[1];
  url = `https://www.youtube.com/embed/${videoId}`;

  delete query.v;
  query.autoplay = autoplay ? 1 : 0;
  url += `?${qs.stringify(query)}`;

  // TODO: https://developers.google.com/youtube/player_parameters
  // More query parameters can be exposed via the component props.

  return (
    <ScalableRect className={theme.container} ratio="16:9">
      <Throbber theme={throbberTheme} />
      <iframe
        allow="autoplay"
        allowFullScreen
        className={theme.video}
        src={url}
        title={title}
      />
    </ScalableRect>
  );
}

const ThemedYouTubeVideo = themed(
  'YouTubeVideo',
  [
    'container',
    'video',
  ],
  baseTheme,
)(YouTubeVideo);

YouTubeVideo.propTypes = {
  autoplay: PT.bool,
  src: PT.string.isRequired,
  theme: ThemedYouTubeVideo.themeType.isRequired,
  title: PT.string,
};

YouTubeVideo.defaultProps = {
  autoplay: false,
  title: '',
};

export default ThemedYouTubeVideo;
