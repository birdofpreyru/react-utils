import PT from 'prop-types';
import { useEffect } from 'react';

import { BaseModal } from 'components/Modal';

import S from './style.scss';

import {
  type OptionT,
  type OptionsT,
  optionsValidator,
  optionValueName,
} from '../../common';

type PropsT = {
  anchorRect: {
    bottom: number;
    left: number;
    width: number;
  };
  containerClass: string;
  filter?: (item: OptionT<React.ReactNode> | string) => boolean;
  optionClass: string;
  options: OptionsT<React.ReactNode>;
  onCancel: () => void;
  onChange: (value: string) => void;
};

const Options: React.FunctionComponent<PropsT> = ({
  anchorRect,
  containerClass,
  filter,
  onCancel,
  onChange,
  optionClass,
  options,
}) => {
  // Closes the dropdown (cancels the selection) on any page scrolling attempt.
  // This is the same native <select> elements do on scrolling, and at least for
  // now we have no reason to deal with complications needed to support open
  // dropdowns during the scrolling (that would need to re-position it in
  // response to the position changes of the root dropdown element).
  useEffect(() => {
    const listener = () => {
      onCancel();
    };
    window.addEventListener('scroll', listener);
    return () => {
      window.removeEventListener('scroll', listener);
    };
  }, [onCancel]);

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
      containerStyle={{
        left: anchorRect.left,
        top: anchorRect.bottom,
        width: anchorRect.width,
      }}
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
      {optionNodes}
    </BaseModal>
  );
};

Options.propTypes = {
  anchorRect: PT.shape({
    bottom: PT.number.isRequired,
    left: PT.number.isRequired,
    width: PT.number.isRequired,
  }).isRequired,
  containerClass: PT.string.isRequired,
  filter: PT.func,
  onCancel: PT.func.isRequired,
  onChange: PT.func.isRequired,
  optionClass: PT.string.isRequired,
  options: optionsValidator.isRequired,
};

Options.defaultProps = {
  filter: undefined,
};

export default Options;
