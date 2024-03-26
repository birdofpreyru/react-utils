import PT from 'prop-types';
import { forwardRef, useImperativeHandle, useRef } from 'react';

import { BaseModal } from 'components/Modal';

import S from './style.scss';

import {
  type OptionT,
  type OptionsT,
  optionsValidator,
  optionValueName,
} from '../../common';

export type ContainerPosT = {
  left: number;
  top: number;
  width: number;
};

export function areEqual(a?: ContainerPosT, b?: ContainerPosT): boolean {
  return a?.left === b?.left && a?.top === b?.top && a?.width === b?.width;
}

export type RefT = {
  measure: () => DOMRect | undefined;
};

type PropsT = {
  containerClass: string;
  containerStyle?: ContainerPosT;
  filter?: (item: OptionT<React.ReactNode> | string) => boolean;
  optionClass: string;
  options: OptionsT<React.ReactNode>;
  onCancel: () => void;
  onChange: (value: string) => void;
};

const Options = forwardRef<RefT, PropsT>(({
  containerClass,
  containerStyle,
  filter,
  onCancel,
  onChange,
  optionClass,
  options,
}, ref) => {
  const opsRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    measure: () => opsRef.current?.getBoundingClientRect(),
  }), []);

  const optionNodes: React.ReactNode[] = [];
  for (let i = 0; i < options.length; ++i) {
    const option = options[i];
    if (!filter || filter(option)) {
      const [iValue, iName] = optionValueName(option);
      optionNodes.push(
        <div
          className={optionClass}
          onClick={() => onChange(iValue)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onChange(iValue);
            }
          }}
          key={iValue}
          role="button"
          tabIndex={0}
        >
          {iName}
        </div>,
      );
    }
  }

  return (
    <BaseModal
      // Closes the dropdown (cancels the selection) on any page scrolling attempt.
      // This is the same native <select> elements do on scrolling, and at least for
      // now we have no reason to deal with complications needed to support open
      // dropdowns during the scrolling (that would need to re-position it in
      // response to the position changes of the root dropdown element).
      cancelOnScrolling
      containerStyle={containerStyle}
      dontDisableScrolling
      onCancel={onCancel}
      theme={{
        ad: '',
        hoc: '',
        container: containerClass,
        context: '',
        overlay: S.overlay,
      }}
    >
      <div ref={opsRef}>{optionNodes}</div>
    </BaseModal>
  );
});

Options.propTypes = {
  containerClass: PT.string.isRequired,

  containerStyle: PT.shape({
    left: PT.number.isRequired,
    top: PT.number.isRequired,
    width: PT.number.isRequired,
  }),

  filter: PT.func,
  onCancel: PT.func.isRequired,
  onChange: PT.func.isRequired,
  optionClass: PT.string.isRequired,
  options: optionsValidator.isRequired,
};

Options.defaultProps = {
  containerStyle: undefined,
  filter: undefined,
};

export default Options;
