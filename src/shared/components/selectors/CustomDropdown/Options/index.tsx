import {
  type FunctionComponent,
  type ReactNode,
  type RefObject,
  useImperativeHandle,
  useRef,
} from 'react';

import { BaseModal } from 'components/Modal';

import {
  type OptionT,
  type OptionsT,
  type ValueT,
  optionValueName,
} from '../../common';

import S from './style.scss';

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
  filter?: (item: OptionT<ReactNode> | ValueT) => boolean;
  optionClass: string;
  options: Readonly<OptionsT<ReactNode>>;
  onCancel: () => void;
  onChange: (value: ValueT) => void;
  ref?: RefObject<RefT | null>;
};

const Options: FunctionComponent<PropsT> = ({
  containerClass,
  containerStyle,
  filter,
  onCancel,
  onChange,
  optionClass,
  options,
  ref,
}) => {
  const opsRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    measure: () => {
      const e = opsRef.current?.parentElement;
      if (!e) return undefined;

      const rect = opsRef.current!.getBoundingClientRect();
      const style = window.getComputedStyle(e);
      const mBottom = parseFloat(style.marginBottom);
      const mTop = parseFloat(style.marginTop);

      rect.height += mBottom + mTop;

      return rect;
    },
  }), []);

  const optionNodes: ReactNode[] = [];
  for (const option of options) {
    if (!filter || filter(option)) {
      const [iValue, iName] = optionValueName(option);
      optionNodes.push(
        <div
          className={optionClass}
          key={iValue}
          onClick={(e) => {
            onChange(iValue);
            e.stopPropagation();
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onChange(iValue);
              e.stopPropagation();
            }
          }}
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
      dontDisableScrolling
      onCancel={onCancel}
      style={containerStyle}
      theme={{
        ad: '',
        container: containerClass,
        context: '',
        hoc: '',
        overlay: S.overlay,
      }}
    >
      <div ref={opsRef}>{optionNodes}</div>
    </BaseModal>
  );
};

export default Options;
