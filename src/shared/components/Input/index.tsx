import {
  type FunctionComponent,
  type ReactNode,
  type Ref,
  useRef,
  useState,
} from 'react';

import themed, { type Theme } from '@dr.pogodin/react-themes';

import defaultTheme from './theme.scss';

type ThemeKeyT = 'children' | 'container' | 'empty' | 'error' | 'errorMessage'
  | 'focused' | 'input' | 'label';

type PropsT = React.InputHTMLAttributes<HTMLInputElement> & {
  children?: ReactNode;
  error?: ReactNode;
  label?: React.ReactNode;
  ref?: Ref<HTMLInputElement>;
  testId?: string;
  theme: Theme<ThemeKeyT>;
};

/**
 * Themeable input field, based on the standard HTML `<input>` element.
 * @param [props.label] Input label.
 * @param [props.theme] _Ad hoc_ theme.
 * @param [props...] [Other theming properties](https://www.npmjs.com/package/@dr.pogodin/react-themes#themed-component-properties)
 * @param [props...] Any other properties are passed to the underlying
 * `<input>` element.
 */
const Input: FunctionComponent<PropsT> = ({
  children,
  error,
  label,
  ref,
  testId,
  theme,
  ...rest
}) => {
  // NOTE: As of now, it is only updated when "theme.focused" is defined,
  // as otherwise its value is not used.
  const [focused, setFocused] = useState(false);

  const localRef = useRef<HTMLInputElement>(null);

  let containerClassName = theme.container;

  // NOTE: As of now, "focused" can be true only when "theme.focused"
  // is provided.
  if (focused /* && theme.focused */) containerClassName += ` ${theme.focused}`;

  if (!rest.value && theme.empty) containerClassName += ` ${theme.empty}`;

  if (error) containerClassName += ` ${theme.error}`;

  return (
    <div
      className={containerClassName}
      onFocus={() => {
        // TODO: It does not really work if a callback-style `ref` is passed in,
        // we need a more complex logic to cover that case, but for now this serves
        // the case we need it for.
        if (typeof ref === 'object') ref?.current?.focus();
        else localRef.current?.focus();
      }}
    >
      {label === undefined ? null : <div className={theme.label}>{label}</div>}
      <input
        className={theme.input}
        data-testid={process.env.NODE_ENV === 'production' ? undefined : testId}
        ref={ref ?? localRef}

        // TODO: Avoid the spreading later.
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...rest}

        onBlur={theme.focused ? (e) => {
          setFocused(false);
          rest.onBlur?.(e);
        } : rest.onBlur}
        onFocus={theme.focused ? (e) => {
          setFocused(true);
          rest.onFocus?.(e);
        } : rest.onFocus}
      />
      {error && error !== true
        ? <div className={theme.errorMessage}>{error}</div>
        : null}
      {children ? <div className={theme.children}>{children}</div> : null}
    </div>
  );
};

export default /* #__PURE__ */ themed(Input, 'Input', defaultTheme);
