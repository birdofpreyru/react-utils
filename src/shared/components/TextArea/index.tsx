import {
  type ChangeEventHandler,
  type FocusEventHandler,
  type FunctionComponent,
  type KeyboardEventHandler,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import themed, { type Theme } from '@dr.pogodin/react-themes';

import defaultTheme from './style.scss';

type ThemeKeyT = 'container' | 'hidden' | 'label' | 'textarea';

type Props = {
  disabled?: boolean;
  label?: string;
  onBlur?: FocusEventHandler<HTMLTextAreaElement>;
  onChange?: ChangeEventHandler<HTMLTextAreaElement>;
  onKeyDown?: KeyboardEventHandler<HTMLTextAreaElement>;
  placeholder?: string;
  testId?: string;
  theme: Theme<ThemeKeyT>;
  value?: string;
};

const TextArea: FunctionComponent<Props> = ({
  disabled,
  label,
  onBlur,
  onChange,
  onKeyDown,
  placeholder,
  testId,
  theme,
  value,
}) => {
  const hiddenAreaRef = useRef<HTMLTextAreaElement>(null);
  const [height, setHeight] = useState<number | undefined>();

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const [localValue, setLocalValue] = useState(value ?? '');
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

  // Resizes the text area when its content is modified.
  //
  // NOTE: useLayoutEffect() instead of useEffect() makes difference here,
  // as it helps to avoid visible "content/height" jumps (i.e. with just
  // useEffect() it becomes visible how the content is modified first,
  // and then input height is incremented, if necessary).
  // See: https://github.com/birdofpreyru/react-utils/issues/313
  useLayoutEffect(() => {
    const el = hiddenAreaRef.current;
    if (el) setHeight(el.scrollHeight);
  }, [localValue]);

  return (
    <div
      className={theme.container}
      onFocus={() => {
        textAreaRef.current?.focus();
      }}
    >
      {label === undefined ? null : <div className={theme.label}>{label}</div>}
      <textarea
        className={`${theme.textarea} ${theme.hidden}`}

        // This text area is hidden underneath the primary one below,
        // and it is used for text measurements, to implement auto-scaling
        // of the primary textarea's height.
        readOnly
        ref={hiddenAreaRef}

        // The "-1" value of "tabIndex" removes this hidden text area from
        // the tab-focus-chain.
        tabIndex={-1}

        // NOTE: With empty string value ("") the scrolling height of this text
        // area is zero, thus collapsing <TextArea> height below the single line
        // input height. To avoid it we fallback to whitespace (" ") character
        // here.
        value={localValue || ' '}
      />
      <textarea
        className={theme.textarea}
        data-testid={process.env.NODE_ENV === 'production' ? undefined : testId}
        disabled={disabled}
        onBlur={onBlur}

        // When value is "undefined" the text area is not-managed, and we should
        // manage it internally for the measurement / resizing functionality
        // to work.
        onChange={
          value === undefined
            ? (e) => {
              setLocalValue(e.target.value);
            } : onChange
        }
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        ref={textAreaRef}
        style={{ height }}
        value={localValue}
      />
    </div>
  );
};

export default themed(TextArea, 'TextArea', defaultTheme);
