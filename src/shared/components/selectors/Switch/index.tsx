import themed, { type Theme } from '@dr.pogodin/react-themes';

import {
  type OptionsT,
  type ValueT,
  optionValueName,
} from '../common';

import defaultTheme from './theme.scss';

type ThemeKeyT = 'container' | 'label' | 'option' | 'options' | 'selected';

type PropsT = {
  label?: React.ReactNode;
  onChange?: (value: ValueT) => void;
  options?: Readonly<OptionsT<React.ReactNode>>;
  theme: Theme<ThemeKeyT>;
  value?: ValueT;
};

const BaseSwitch: React.FunctionComponent<PropsT> = ({
  label,
  onChange,
  options,
  theme,
  value,
}) => {
  if (!options || !theme.option) throw Error('Internal error');

  const optionNodes: React.ReactNode[] = [];
  for (const option of options) {
    const [iValue, iName] = optionValueName(option);

    let className: string = theme.option;
    let onPress: (() => void) | undefined;
    if (iValue === value) className += ` ${theme.selected}`;
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
    <div className={theme.container}>
      {label ? <div className={theme.label}>{label}</div> : null}

      <div className={theme.options}>
        {optionNodes}
      </div>
    </div>
  );
};

export default themed(BaseSwitch, 'Switch', defaultTheme);
