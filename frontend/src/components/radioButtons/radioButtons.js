import React from 'react';
import './radioButtons.scss';

export function RadioButtons({
  name,
  value,
  options,
  className,
  onChange,
  disabled,
  id,
}) {
  return (
    <div id={id} className={`${disabled ? 'disabled' : ''} radio-button-component ${className}`}>
      {options?.map((option, index)=>(
        <label
          className={`${option.value === value ? 'radio-selected' : 'radio-not-selected'} radio-button-item`}
          key={`${option.value}_${index}`}>
          <input
            disabled={disabled}
            type="radio"
            value={option.value}
            name={name}
            checked={option.value === value}
            onChange={onChange}
          />
          &nbsp;
          <span>{option.label}</span>
        </label>
      ))}
    </div>
  );
}
