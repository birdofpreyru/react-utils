/* global document */

import { noop } from 'lodash';

import {
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import ReactDom from 'react-dom';
import PT from 'prop-types';
import themed, { type Theme } from '@dr.pogodin/react-themes';

import baseTheme from './base-theme.scss';
import './styles.scss';

type PropsT = {
  children?: ReactNode;
  onCancel?: () => void;
  theme: Theme & {
    container?: string;
    overlay?: string;
  };
};

/**
 * The `<Modal>` component implements a simple themeable modal window, wrapped
 * into the default theme. `<BaseModal>` exposes the base non-themed component.
 * **Children:** Component children are rendered as the modal content.
 * @param {object} props Component properties. Beside props documented below,
 *  [Other theming properties](https://www.npmjs.com/package/@dr.pogodin/react-themes#themed-component-properties) are supported as well.
 * @param {function} [props.onCancel] The callback to trigger when user
 * clicks outside the modal, or presses Escape. It is expected to hide the
 * modal.
 * @param {ModalTheme} [props.theme] _Ad hoc_ theme.
 */
const BaseModal: React.FunctionComponent<PropsT> = ({
  children,
  onCancel,
  theme,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const [portal, setPortal] = useState<HTMLDivElement>();

  useEffect(() => {
    const p = document.createElement('div');
    document.body.classList.add('scrolling-disabled-by-modal');
    document.body.appendChild(p);
    setPortal(p);
    return () => {
      document.body.classList.remove('scrolling-disabled-by-modal');
      document.body.removeChild(p);
    };
  }, []);

  const focusLast = useMemo(() => (
    <div
      onFocus={() => {
        const elems = containerRef.current?.querySelectorAll('*') as NodeListOf<HTMLElement>;
        for (let i = elems.length - 1; i >= 0; --i) {
          elems[i].focus();
          if (document.activeElement === elems[i]) return;
        }
        overlayRef.current?.focus();
      }}
      /* eslint-disable jsx-a11y/no-noninteractive-tabindex */
      tabIndex={0}
      /* eslint-enable jsx-a11y/no-noninteractive-tabindex */
    />
  ), []);

  return portal ? ReactDom.createPortal(
    (
      <>
        {focusLast}
        <div
          aria-label="Cancel"
          className={theme.overlay}
          onClick={() => onCancel && onCancel()}
          onKeyDown={(e) => {
            if (e.key === 'Escape' && onCancel) onCancel();
          }}
          ref={(node) => {
            if (node && node !== overlayRef.current) {
              overlayRef.current = node;
              node.focus();
            }
          }}
          role="button"
          tabIndex={0}
        />
        <div
          aria-modal="true"
          className={theme.container}
          onWheel={(event) => event.stopPropagation()}
          ref={containerRef}
          role="dialog"
        >
          {children}
        </div>
        <div
          onFocus={() => {
            overlayRef.current?.focus();
          }}
          /* eslint-disable jsx-a11y/no-noninteractive-tabindex */
          tabIndex={0}
          /* eslint-enable jsx-a11y/no-noninteractive-tabindex */
        />
        {focusLast}
      </>
    ),
    portal,
  ) : null;
};

const ThemedModal = themed(
  BaseModal,
  'Modal',
  [
    'container',
    'overlay',
  ],
  baseTheme,
);

BaseModal.propTypes = {
  onCancel: PT.func,
  children: PT.node,
  theme: ThemedModal.themeType.isRequired,
};

BaseModal.defaultProps = {
  onCancel: noop,
  children: null,
};

export default ThemedModal;

/* Non-themed version of the Modal. */
export { BaseModal };