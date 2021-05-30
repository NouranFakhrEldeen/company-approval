import React, { forwardRef, useState, useEffect } from 'react';
import './delayed-input.style.scss';
const delayedInput = forwardRef(({
  onChange,
  name,
  className,
  placeholder,
  placeholderOverlay,
  value,
  delay,
  disabled,
  type,
  icon,
}, ref) => {
  const [data, setData] = useState({ target: { value: value || '', name } });
  const [val, setVal] = useState('');
  const debouncedTerm = useDebounce(data || {}, delay);
  useEffect(() => {
    onChange(debouncedTerm);
  }, [debouncedTerm]);

  const renderPlaceholder = (message, required, ref)=>{
    return (
      <div className={`placeholder ${icon ? 'with-icon' : ''}`} onClick={()=>ref.current?.focus()}>
        <label>
          {message}
        </label>
        {required ?
          <span className='fas fa-asterisk required'/> : null}
      </div>
    );
  };
  useEffect(() => {
    value && setVal(value);
  }, [value]);
  return (
    <div className={`delayed-input-component margin-bottom-20 ${className || ''}`}>
      { icon ? <span className="input-icon"><span className={`icon ${icon}`} /></span> : null}
      <div className={`input-container ${icon ? 'with-icon' : ''}`}>
        {!val?.length && placeholderOverlay ?
          renderPlaceholder(placeholderOverlay.message, placeholderOverlay.required, ref) : null }
        <textarea
          className={`${icon ? 'with-icon' : ''}`}
          disabled={disabled}
          placeholder={placeholder}
          ref={ref}
          value={val}
          onChange={e => {setData(e); setVal(e.target.value);}}
          type={type}
          name={name}
          data-testid={'delayed-input-it'}
          rows="1"
        />
      </div>
    </div>
  );
});

export const DelayedInput = delayedInput;

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value]);
  return debouncedValue;
}