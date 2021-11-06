# Link

```js
import { Link } from '@dr.pogodin/react-utils';
```

The [Link] and almost identical [NavLink] components are auxiliary wrappers for
[React Router]'s components of the same names; they help to handle external and
internal hyperlinks in a uniform manner. The [NavLink] additionally helps to
apply conditional hyperlink styling when its URL matches the current location.

A [Link] ([NavLink]) instance is rendered as a simple `<a>` element in
the following cases:
1.  If its URL is absolute, _i.e._ it starts with **https://** or **https://**.
2.  If it points to an anchor, _i.e._ its URL starts with **#** symbol.
3.  If it should be opened in a new tab; _i.e._ its `openNewTab` property
    equals **true**.
4.  If it was opted explicitly, _i.e._ its `enforceA` property equals **true**.

Otherwise it is rendered as the usual [React Router]'s `<Link>` (`<NavLink>`)
component. In this case the link also scrolls the document to the top each time
the link is triggered, if such behaviour was not opted out explicitly, _i.e._
if its  `keepScrollPosition` property is not equal **true**.

Both `<Link>` and `<NavLink>` support all properties of the underlying
[React Router]'s components, along with some additional props.

## Properties

### Common
- `children` - **React Node** - Component children, if any, will be rendered as
  the link's content.
- `className` - **string** - CSS class(es) to apply.
- `disabled` - **boolean** - Disables the link.
- `enforceA` - **boolean** - Enforces rendering of the link as a simple `<a>`
  element.
- `keepScrollPosition` - **boolean** - If set, and if the link is rendered as
  a [React Router]'s component, it won't reset the viewport scrolling position
  to the top when the link is triggered.
- `onClick` - **function** - Event handler for clicks.
- `onMouseDown` - **function** - Event handler for "mouse down" events.
- `openNewTab` - **boolean** - Opts to open the link in a new tab.
- `replace` - **boolean** - Opts to replace the current entry in the navigation
  history stack when the link is triggered, instead of adding a new entry into
  the stack.
- `to` - **string** - Target URL.

### [NavLink]-only
- `caseSensitive` - **boolean**
- `className` - **string** | **function** - By default "active" classname is
  automatically added if the link is active. The prop can be a function with
  the signature: `(isActive: boolean) => string`.
- `end` - **boolean** - Opts to apply the active state only if the current
  location is at the end of this link's URL.
- `style` - **object** | **function** - Can be either styles object,
  or a function with the signature `(isActive: boolean) => object`.

[Link]: /docs/api/components/link
[NavLink]: /docs/api/components/navlink
[React Router]: https://reactrouter.com/docs/en/v6

