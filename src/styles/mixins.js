// This module just contains documentaiton for mixin.scss

/**
 * @category Styling
 * @module SCSS_Mixins
 * @desc
 * ```scss
 * // Note: there should be no whitespace between @ and import at the next line,
 * // it had to be added due to restrictions of the documentation system.
 * @ import "@dr.pogodin/react-utils/mixins";
 * ```
 * Currently, there are three kinds of SCSS mixins provided by the library:
 * - **Font Mixins**
 * - **Media Mixins**
 * - **Simple Typography**
 *
 * ### Font Mixins
 * - `@mixin font-family($name, $weight, $style, $url, $file);`
 *
 *   The `font-family` mixins generates a `@font-face` declaration for
 *   inclusion of the specified font into the app. The font is assumed
 *   to be provided in the following formats: EOT, WOFF, TTF, SVG.
 *   - `$name` &ndash; Font name (to reference the loaded font from SCSS in
 *     the SCSS stylesheets);
 *   - `$weight` &ndash; Font weight;
 *   - `$style` &ndash; Font style, *normal* or *italic*;
 *   - `$url` &ndash; Path to the font files (without the filename);
 *   - `$file` &ndash; Name of the font files (without extension).
 *     It is supposed that all files related to the font have the same name,
 *     and differs only be their extensions.
 * - `@mixin font-family-ttf($name, $weight, $style, $url);`
 *
 *   Similar to the `font-family` mixins, but loads only fonts in TTF
 *   format.
 *   - `$name` &ndash; Font name (to reference the loaded font from SCSS in
 *     the SCSS stylesheets);
 *   - `$weight` &ndash; Font weight;
 *   - `$style` &ndash; Font style, *normal* or *italic*;
 *   - `$url` &ndash; Path to the font file, including the filename (without
 *     file extension).
 *
 * ### Media Mixins
 * These mixins help to create conditional SCSS, responsive to the viewport
 * size.
 *
 * We consider five viewport sizes: extra-small (XS), small (SM), medium (MD),
 * large (LG), and extra-large (XL). It is assumed that mobile devices have SM
 * screen size; tablets have MD screens, and desktops have LG or XL screen size.
 * The actual break-points between these sizes are defined by four variables
 * with the following default values:
 * - `$screen-xs` &ndash; 320px
 * - `$screen-sm` &ndash; 495px
 * - `$screen-mm` &ndash; 768px
 * - `$screen-md` &ndash; 1024px
 * - `$screen-lg` &ndash; 1280px
 *
 * Each of these variables set the maximal pixel size of the corresponding
 * viewport; i.e. XS viewport may have any width under `$screen-xs` (inclusive);
 * MD viewport may have a width from `$screen-sm` (exclusive) up to `$screen-md`
 * (inclusive); XL viewport may have any width above `$screen-lg` (exclusive).
 *
 * Based on these variables, we provide two sets of media mixins:
 * - `@mixin xs`, `@mixin sm`, `@mixin mm`, `@mixin md`, `@mixin lg`,
 *   `@mixin xl` &ndash; allow to apply styling to a single specified
 *   size of the viewport;
 * - `@mixin xs-to-sm`, `@mixin xs-to-mm`, `@mixin xs-to-md`, `@mixin xs-to-lg`,
 *   `@mixin sm-to-mm`, `@mixin sm-to-md`, `@mixin sm-to-lg`, `@mixin sm-to-xl`,
 *   `@mixin mm-to-md`, `@mixin mm-to-lg`, `@mixin mm-to-xl`,
 *   `@mixin md-to-lg`, `@mixin md-to-xl`, `@mixin lg-to-xl` &ndash;
 *   allow to apply styling for a range of viewport sizes, from the first
 *   mentioned in the mixin name to the last one, both inclusive.
 *
 * The both kinds of these mixins you can use the same way:
 * ```scss
 * // style.scss
 * .someClass {
 *   // General style
 *   background: green;
 *
 *   // The element will become red on the smallest screens (XS to SM), which
 *   // means any screen smaller than MD. Also, there should be no whitespace
 *   // between @ and include at the following line.
 *   @ include xs-to-sm {
 *     background: red;
 *   }
 * }
 * ```
 *
 * ### Simple Typography
 * When you did not have time yet to care about typography in your project,
 * but you already need to display a textual content better than
 * [CSS reset](global-styles.md) makes it to look, here is a drop-in temporary
 * typography mixin:
 * ```scss
 *  .someClass {
 *    // Note: there should be no whitespace between @ and include at
 *    // the following line.
 *    @ include typography;
 *  }
 * ```
*/
