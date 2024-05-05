import { useEffect, useRef, useState } from 'react';
import PT from 'prop-types';

import themed, { type Theme } from '@dr.pogodin/react-themes';

import defaultTheme from './style.scss';

const validThemeKeys = [
  'container',
  'hidden',
  'textarea',
] as const;

type Props = {
  disabled?: boolean;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLTextAreaElement>;
  placeholder?: string;
  theme: Theme<typeof validThemeKeys>;
  value?: string;
};

const TextArea: React.FunctionComponent<Props> = ({
  disabled,
  onChange,
  onKeyDown,
  placeholder,
  theme,
  value,
}) => {
  const hiddenAreaRef = useRef<HTMLTextAreaElement>(null);
  const [height, setHeight] = useState<number | undefined>();

  const [localValue, setLocalValue] = useState(value || '');
  if (value !== undefined && localValue !== value) setLocalValue(value);

  // This resizes text area's height when its width is changed for any reason.
  useEffect(() => {
    const el = hiddenAreaRef.current;
    if (!el) return undefined;

    const cb = () => {
      setHeight(el.scrollHeight);
    };
    const observer = new ResizeObserver(cb);
    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, []);

  // This resizes the text area when its content is modified.
  useEffect(() => {
    const el = hiddenAreaRef.current;
    if (el) setHeight(el.scrollHeight);
  }, [localValue]);

  return (
    <div className={theme.container}>
      <textarea
        // This text area is hidden underneath the primary one below,
        // and it is used for text measurements, to implement auto-scaling
        // of the primary textarea's height.
        readOnly
        ref={hiddenAreaRef}
        className={`${theme.textarea} ${theme.hidden}`}
        value={localValue}
      />
      <textarea
        disabled={disabled}
        // When value is "undefined" the text area is not-managed, and we should
        // manage it internally for the measurement / resizing functionality
        // to work.
        onChange={value === undefined ? ((e) => {
          setLocalValue(e.target.value);
        }) : onChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        style={{ height }}
        className={theme.textarea}
        value={localValue}
      />
    </div>
  );
};

const ThemedTextArea = themed(
  TextArea,
  'TextArea',
  validThemeKeys,
  defaultTheme,
);

TextArea.propTypes = {
  disabled: PT.bool,
  onChange: PT.func,
  onKeyDown: PT.func,
  placeholder: PT.string,
  theme: ThemedTextArea.themeType.isRequired,
  value: PT.string,
};

export default ThemedTextArea;
