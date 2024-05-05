import PT from 'prop-types';
import { useEffect, useRef, useState } from 'react';

import themed from '@dr.pogodin/react-themes';

import Options, { type ContainerPosT, type RefT, areEqual } from './Options';

import defaultTheme from './theme.scss';

import {
  type PropsT,
  type ValueT,
  optionValidator,
  optionValueName,
  validThemeKeys,
  valueValidator,
} from '../common';

const BaseCustomDropdown: React.FunctionComponent<
PropsT<React.ReactNode, (value: ValueT) => void>
> = ({
  filter,
  label,
  onChange,
  options,
  theme,
  value,
}) => {
  if (!options) throw Error('Internal error');

  const [active, setActive] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const opsRef = useRef<RefT>(null);

  const [opsPos, setOpsPos] = useState<ContainerPosT>();
  const [upward, setUpward] = useState(false);

  useEffect(() => {
    if (!active) return undefined;

    let id: number;
    const cb = () => {
      const anchor = dropdownRef.current?.getBoundingClientRect();
      const opsRect = opsRef.current?.measure();
      if (anchor && opsRect) {
        const fitsDown = anchor.bottom + opsRect.height
          < (window.visualViewport?.height ?? 0);
        const fitsUp = anchor.top - opsRect.height > 0;

        const up = !fitsDown && fitsUp;
        setUpward(up);

        const pos = up ? {
          top: anchor.top - opsRect.height - 1,
          left: anchor.left,
          width: anchor.width,
        } : {
          left: anchor.left,
          top: anchor.bottom,
          width: anchor.width,
        };

        setOpsPos((now) => (areEqual(now, pos) ? now : pos));
      }
      id = requestAnimationFrame(cb);
    };
    requestAnimationFrame(cb);

    return () => {
      cancelAnimationFrame(id);
    };
  }, [active]);

  const openList = (
    e: React.KeyboardEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>,
  ) => {
    const view = window.visualViewport;
    const rect = dropdownRef.current!.getBoundingClientRect();
    setActive(true);

    // NOTE: This first opens the dropdown off-screen, where it is measured
    // by an effect declared above, and then positioned below, or above
    // the original dropdown element, depending where it fits best
    // (if we first open it downward, it would flick if we immediately
    // move it above, at least with the current position update via local
    // react state, and not imperatively).
    setOpsPos({
      left: view?.width || 0,
      top: view?.height || 0,
      width: rect.width,
    });

    e.stopPropagation();
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
  if (active) containerClassName += ` ${theme.active}`;

  let opsContainerClass = theme.select || '';
  if (upward) {
    containerClassName += ` ${theme.upward}`;
    opsContainerClass += ` ${theme.upward}`;
  }

  return (
    <div className={containerClassName}>
      {label === undefined ? null : (
        <div className={theme.label}>{label}</div>
      )}
      <div
        className={theme.dropdown}
        onClick={openList}
        onKeyDown={(e) => {
          if (e.key === 'Enter') openList(e);
        }}
        ref={dropdownRef}
        role="listbox"
        tabIndex={0}
      >
        {selected}
        <div className={theme.arrow} />
      </div>
      {
        active ? (
          <Options
            containerClass={opsContainerClass}
            containerStyle={opsPos}
            onCancel={() => {
              setActive(false);
            }}
            onChange={(newValue) => {
              setActive(false);
              if (onChange) onChange(newValue);
            }}
            optionClass={theme.option || ''}
            options={options}
            ref={opsRef}
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
  value: valueValidator,
};

export default ThemedCustomDropdown;
