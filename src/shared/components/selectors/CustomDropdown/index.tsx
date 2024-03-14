import PT from 'prop-types';
import { useRef, useState } from 'react';

import themed from '@dr.pogodin/react-themes';

import Options from './Options';

import defaultTheme from './theme.scss';

import {
  type PropsT,
  optionValidator,
  optionValueName,
  validThemeKeys,
} from '../common';

const BaseCustomDropdown: React.FunctionComponent<
PropsT<React.ReactNode, (value: string) => void>
> = ({
  filter,
  label,
  onChange,
  options,
  theme,
  value,
}) => {
  if (!options) throw Error('Internal error');

  const dropdownRef = useRef<HTMLDivElement>(null);

  // If "null" the dropdown is closed, otherwise it is displayed
  // at the specified coordinates.
  const [anchor, setAnchor] = useState<DOMRect | null>(null);

  const openList = () => {
    setAnchor(dropdownRef.current!.getBoundingClientRect());
  };

  let selected: React.ReactNode = <>&zwnj;</>;
  for (let i = 0; i < options.length; ++i) {
    const option = options[i];
    if (!filter || filter(option)) {
      const [iValue, iName] = optionValueName(option);
      if (iValue === value) {
        selected = iName;
        break;
      }
    }
  }

  let containerClassName = theme.container;
  if (anchor) containerClassName += ` ${theme.active}`;

  return (
    <div className={containerClassName}>
      {label === undefined ? null : (
        <div className={theme.label}>{label}</div>
      )}
      <div
        className={theme.dropdown}
        onClick={openList}
        onKeyDown={(e) => {
          if (e.key === 'Enter') openList();
        }}
        ref={dropdownRef}
        role="listbox"
        tabIndex={0}
      >
        {selected}
        <div className={theme.arrow} />
      </div>
      {
        anchor ? (
          <Options
            anchorRect={anchor}
            containerClass={theme.select || ''}
            onCancel={() => setAnchor(null)}
            onChange={(newValue) => {
              setAnchor(null);
              if (onChange) onChange(newValue);
            }}
            optionClass={theme.option || ''}
            options={options}
          />
        ) : null
      }
    </div>
  );
};

const ThemedCustomDropdown = themed(
  BaseCustomDropdown,
  'CustomDropdown',
  validThemeKeys,
  defaultTheme,
);

BaseCustomDropdown.propTypes = {
  filter: PT.func,
  label: PT.node,
  onChange: PT.func,
  options: PT.arrayOf(optionValidator.isRequired),
  theme: ThemedCustomDropdown.themeType.isRequired,
  value: PT.string,
};

BaseCustomDropdown.defaultProps = {
  filter: undefined,
  label: undefined,
  onChange: undefined,
  options: [],
  value: undefined,
};

export default ThemedCustomDropdown;
