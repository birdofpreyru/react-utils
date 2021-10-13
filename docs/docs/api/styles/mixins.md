# SCSS Mixins
The library provides a bunch of SCSS mixins useful in most of host apps. To use
them in a SCSS file import:
```scss
@import "@dr.pogodin/react-utils/mixins";
```
:::info Note
It might be more convenient to have a local `mixin` file local to the host
codebase, and import `react-utils` mixins into that file. Alongside that import
it may contain any additional mixins specific to the project. Then that local
mixin file can be imported whenever mixins are needed, and then both local and
`react-utils` mixins can be used side-by-side in a host SCSS file.
:::

## Font Mixins
### font-family()
```scss
@mixin font-family($name, $weight, $style, $url, $file)
```
Generates a a `@font-face` declaration for inclusion of the specified font into
the app. The font is assumed to be provided in the following formats: EOT, WOFF,
TTF, SVG.

**Arguments**
- `$name` - Font name (to reference the loaded font inside SCSS).
- `$weight` - Font weight.
- `$style` - Font style, either **normal** or **italic**.
- `$url` - Path to the font files, without the filename.
- `$file` - Name of the font files, without extension. It is supposed that all
  files related to the font have the same name, and differs by their extensions
  only.

### font-family-ttf()
```scss
@mixin font-family-ttf($name, $weight, $style, $url)
```
Similar to the [font-family()](#font-family) mixins, but loads only fonts in TTF
format.

**Arguments**
- `$name` - Font name (to reference the loaded font in SCSS code).
- `$weight` - Font weight.
- `$style` - Font style, either **normal** or **italic**.
- `$url` - Path to the font file, including the filename, without file extension.

## Media Mixins
Media mixins help to create conditional SCSS, responsive to the viewport size.

The library assumes six viewport sizes: extra-small (**xs**), small (**sm**),
medium (**mm** and **md**), large (**lg**), and extra-large (**xl**). It is
assumed that mobile devices have the screen size up to **sm**, tablets have
the screen size up to **md**, and desktops have screen sizes from **lg** and
larger (sure, because of window resizing and other circumstances different
sizes may be encountered on different devices).

The actual break-points between these sizes are defined by five variables
with these default values:
- `$screen-xs` = 320px
- `$screen-sm` = 495px
- `$screen-mm` = 768px
- `$screen-md` = 1024px
- `$screen-lg` = 1280px

Each of these variables set the maximal pixel size of the corresponding
viewport; _i.e._ **xs** viewport has its width under `$screen-xs` (inclusive);
**md** viewport has its width betweeen `$screen-mm` (exclusive) and up to
`$screen-md` (inclusive); **xl** viewport has its width above
`$screen-lg` (exclusive).

Based on these variables and assumptions the library provides to sets of media
query mixins:
- `@mixin xs`, `@mixin sm`, `@mixin mm`, `@mixin md`, `@mixin lg`, `@mixin xl` -
  allow to apply a styling to the single specified size of the viewport.
- `@mixin xs-to-sm`, `@mixin xs-to-mm`, `@mixin xs-to-md`, `@mixin xs-to-lg`,
  `@mixin sm-to-mm`, `@mixin sm-to-md`, `@mixin sm-to-lg`, `@mixin sm-to-xl`,
  `@mixin mm-to-md`, `@mixin mm-to-lg`, `@mixin mm-to-xl`,
  `@mixin md-to-lg`, `@mixin md-to-xl`, `@mixin lg-to-xl` -
  allow to apply a styling to the given range of the viewport sizes,
  from the first size mentioned in the mixin name, to the last one, both
  inclusive.

**Example**
```scss
.someClass {
  // General style: green background.
  background: green;

  // The element gets red background if the viewport size is between
  // "xs" and "sm", both inclusive. As "xs" viewport size starts from zero,
  // this effectively means "on any viewport smaller than 495px (sm) width".
  @include xs-to-sm {
    background: red;
  }
}
```

## Simple Typography
The library provides a simple, but reasonable typography mixins for styling
textual content. It is handy for rapid prototyping, taking into account that
default browser's text styles are cleared out by
[the global CSS stylesheet](/docs/api/styles/global).

**Example**

Simply drop it into the class of textual content container (or even into
the style of `body` element, if it does not mess your other styling):
```scss
.someClass {
  // The textual content inside this element and its children will be styled
  // reasonably.
  @include typography;
}
```
