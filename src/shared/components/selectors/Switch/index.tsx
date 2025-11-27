import type { FunctionComponent, ReactNode } from 'react';

import { type Theme, useTheme } from '@dr.pogodin/react-themes';

import {
  type OptionsT,
  type ValueT,
  optionValueName,
} from '../common';

import defaultTheme from './theme.scss';

type ThemeT = Theme<'container' | 'label' | 'option' | 'options' | 'selected'>;

type PropsT = {
  label?: ReactNode;
  onChange?: (value: ValueT) => void;
  options?: Readonly<OptionsT<ReactNode>>;
  theme?: ThemeT;
  value?: ValueT;
};

export const Switch: FunctionComponent<PropsT> = ({
  label,
  onChange,
  options,
  theme,
  value,
}) => {
  const composed = useTheme('Switch', defaultTheme, theme);

  if (!options || !composed.option) throw Error('Internal error');

  const optionNodes: React.ReactNode[] = [];
  for (const option of options) {
    const [iValue, iName] = optionValueName(option);

    let className: string = composed.option;
    let onPress: (() => void) | undefined;
    if (iValue === value) className += ` ${composed.selected}`;
    else if (onChange) {
      onPress = () => {
        onChange(iValue);
      };
    }

    optionNodes.push(
      onPress
        ? (
          <div
            className={className}
            key={iValue}
            onClick={onPress}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onPress();
            }}
            role="button"
            tabIndex={0}
          >
            {iName}
          </div>
        )
        : <div className={className} key={iValue}>{iName}</div>,
    );
  }

  return (
    <div className={composed.container}>
      {label ? <div className={composed.label}>{label}</div> : null}

      <div className={composed.options}>
        {optionNodes}
      </div>
    </div>
  );
};
