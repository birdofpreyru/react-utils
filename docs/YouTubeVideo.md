# YouTube Video

```js
import { YouTubeVideo } from '@dr.pogodin/react-utils';
```

A component for embeding a YouTube video.

### Props

- `autoplay?: boolean = false` &ndash; Optional. If `true` the video will start
  to play automatically once loaded. Defaults `false`.
- `src: string` &ndash; URL of the video to play. Can be in any of the following
  formats, and keeps any additional query parameters understood by the YouTube
  IFrame player:
  - `https://www.youtube.com/watch?v=NdF6Rmt6Ado`
  - `https://youtu.be/NdF6Rmt6Ado`
  - `https://www.youtube.com/embed/NdF6Rmt6Ado`
- `title: string` &ndash; Optional. The `title` attribute to add to the player
  IFrame. Defaults empty string.
