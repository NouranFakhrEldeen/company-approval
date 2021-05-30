/* eslint-disable no-unused-vars */
import React, { forwardRef } from 'react';
import { capitalizeFirstWord } from '../../helpers';
import './textarea.scss';

const textarea = forwardRef(({
  placeholder,
  value,
  id,
  name,
  classes,
  onChange,
  disabled },
ref,
) => {
  return (
    <div className={'col-sm-5 col-lg-12 padding-0 '}>
      <textarea
        ref={ref}

        data-testid='textArea'
        name={name}
        value={value}
        onChange={(e) => onChange(e)}
        className={classes}
        placeholder={capitalizeFirstWord(placeholder)}
        disabled= {disabled}
      />
    </div>
  );
}
);

export const Textarea = textarea;
