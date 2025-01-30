import {
  type FocusEventHandler,
  useEffect,
  useRef,
  useState,
} from 'react';

import themed, { type Theme } from '@dr.pogodin/react-themes';

import defaultTheme from './style.scss';

type ThemeKeyT =
  | 'container'
  | 'hidden'
  | 'textarea';

type Props = {
  disabled?: boolean;
  onBlur?: FocusEventHandler<HTMLTextAreaElement>;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLTextAreaElement>;
  placeholder?: string;
  theme: Theme<ThemeKeyT>;
  value?: string;
};

const TextArea: React.FunctionComponent<Props> = ({
  disabled,
  onBlur,
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
        onBlur={onBlur}
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

export default themed(TextArea, 'TextArea', defaultTheme);
