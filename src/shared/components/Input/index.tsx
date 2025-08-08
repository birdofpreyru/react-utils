import { type FunctionComponent, type Ref, useRef } from 'react';

import themed, { type Theme } from '@dr.pogodin/react-themes';

import defaultTheme from './theme.scss';

type ThemeKeyT = 'container' | 'empty' | 'input' | 'label';

type PropsT = React.InputHTMLAttributes<HTMLInputElement> & {
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
  label,
  ref,
  testId,
  theme,
  ...rest
}) => {
  const localRef = useRef<HTMLInputElement>(null);

  let containerClassName = theme.container;
  if (!rest.value && theme.empty) containerClassName += ` ${theme.empty}`;

  return (
    <span
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
      />
    </span>
  );
};

export default themed(Input, 'Input', defaultTheme);
