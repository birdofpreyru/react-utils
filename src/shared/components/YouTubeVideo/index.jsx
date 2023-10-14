import PT from 'prop-types';
import qs from 'qs';
import themed from '@dr.pogodin/react-themes';

import ScalableRect from 'components/ScalableRect';
import Throbber from 'components/Throbber';

import baseTheme from './base.scss';
import throbberTheme from './throbber.scss';

/**
 * A component for embeding a YouTube video.
 * @param {object} [props] Component properties.
 * @param {boolean} [props.autoplay] If `true` the video will start to play
 * automatically once loaded.
 * @param {string} [props.src] URL of the video to play. Can be in any of
 * the following formats, and keeps any additional query parameters understood
 * by the YouTube IFrame player:
 * - `https://www.youtube.com/watch?v=NdF6Rmt6Ado`
 * - `https://youtu.be/NdF6Rmt6Ado`
 * - `https://www.youtube.com/embed/NdF6Rmt6Ado`
 * @param {YouTubeVideoTheme} [props.theme] _Ad hoc_ theme.
 * @param {string} [props.title] The `title` attribute to add to the player
 * IFrame.
 */
function YouTubeVideo({
  autoplay,
  src,
  theme,
  title,
}) {
  let [url, query] = src.split('?');
  query = query ? qs.parse(query) : {};

  const videoId = query.v || url.match(/\/([a-zA-Z0-9-_]*)$/)[1];
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
