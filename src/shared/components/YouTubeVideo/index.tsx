import qs from 'qs';

import themed, { type Theme } from '@dr.pogodin/react-themes';

import Throbber from 'components/Throbber';

import baseTheme from './base.scss';
import throbberTheme from './throbber.scss';

type ComponentThemeT = Theme<'container' | 'video'>;

type PropsT = {
  autoplay?: boolean;
  src: string;
  theme: ComponentThemeT;
  title?: string;
};

/**
 * A component for embeding a YouTube video.
 * @param [props] Component properties.
 * @param [props.autoplay] If `true` the video will start to play
 * automatically once loaded.
 * @param [props.src] URL of the video to play. Can be in any of
 * the following formats, and keeps any additional query parameters understood
 * by the YouTube IFrame player:
 * - `https://www.youtube.com/watch?v=NdF6Rmt6Ado`
 * - `https://youtu.be/NdF6Rmt6Ado`
 * - `https://www.youtube.com/embed/NdF6Rmt6Ado`
 * @param [props.theme] _Ad hoc_ theme.
 * @param [props.title] The `title` attribute to add to the player
 * IFrame.
 */
const YouTubeVideo: React.FunctionComponent<PropsT> = ({
  autoplay,
  src,
  theme,
  title,
}) => {
  const srcParts = src.split('?');
  let [url] = srcParts;
  const [, queryString] = srcParts;
  const query = queryString ? qs.parse(queryString) : {};

  const videoId = query.v ?? url?.match(/\/([a-zA-Z0-9-_]*)$/)?.[1];
  url = `https://www.youtube.com/embed/${videoId as string}`;

  delete query.v;
  query.autoplay = autoplay ? '1' : '0';
  url += `?${qs.stringify(query)}`;

  // TODO: https://developers.google.com/youtube/player_parameters
  // More query parameters can be exposed via the component props.

  return (
    <div className={theme.container}>
      <Throbber theme={throbberTheme} />
      {/* TODO: I guess, we better add the sanbox, but right now I don't have
          time to carefully explore which restrictions should be lifted to allow
          embed YouTube player to work... sometime later we'll take care of it */
      }
      <iframe // eslint-disable-line react/iframe-missing-sandbox
        allow="autoplay"
        allowFullScreen
        className={theme.video}
        src={url}
        title={title}
      />
    </div>
  );
};

export default /* #__PURE__ */ themed(YouTubeVideo, 'YouTubeVideo', baseTheme);
