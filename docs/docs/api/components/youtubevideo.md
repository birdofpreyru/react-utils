# YouTubeVideo
```jsx
import { YouTubeVideo } from '@dr.pogodin/react-utils';
```
The [YouTubeVideo] component renders an embed [YouTube] video.

import { YouTubeVideo } from '@dr.pogodin/react-utils';

:::danger Demo
The live example is temporarily removed, until Docusaurus is fully
compatible with React **v18+**.
:::

## Properties
- `autoplay` - **boolean** - Set **true** to automatically start video playback
  when loaded.
- `src` - **string** - URL of the video to play. It can be in any of
  the following formats, and keeps any additional query parameters understood
  by the [YouTube IFrame player](https://developers.google.com/youtube/iframe_api_reference):
  - [`https://www.youtube.com/watch?v=NdF6Rmt6Ado`](https://www.youtube.com/watch?v=NdF6Rmt6Ado)
  - [`https://youtu.be/NdF6Rmt6Ado`](https://youtu.be/NdF6Rmt6Ado)
  - [`https://www.youtube.com/embed/NdF6Rmt6Ado`](https://www.youtube.com/embed/NdF6Rmt6Ado)
- `theme` - [YouTubeVideoTheme] - _Ad hoc_ [React Themes] theme.
- `title` - **string** - The `title` attribute to add to the player's iframe.
- Other [props of a themed component](https://www.npmjs.com/package/@dr.pogodin/react-themes#themed-component-properties).

### YouTubeVideoTheme
See [React Themes] docs to learn how the visual component theming works.
The valid theme keys for [YouTubeVideo] component are:
- `container` - The root component element, which is an instance of
  [ScalableRect].
- `video` - The YouTube iframe player element.

[React Themes]: https://dr.pogodin.studio/docs/react-themes
[ScalableRect]: /docs/api/components/scalablerect
[YouTube]: https://www.youtube.com
[YouTubeVideo]: /docs/api/components/youtubevideo
[YouTubeVideoTheme]: #youtubevideotheme
