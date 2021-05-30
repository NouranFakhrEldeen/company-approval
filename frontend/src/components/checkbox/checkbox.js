/* eslint-disable no-unused-vars */

import React, { useState } from 'react';
import { capitalizeFirstWord } from '../../helpers';
import './checkbox.scss';


function checkbox({
  containerClasses,
  testID,
  id,
  name,
  spanValue,
  onChange,
  checked,
  //   checkbox,
  //   handleChange,
}) {
  const [checkbox, setCheckbox] = useState(true);

  const handleChange = (e) => {
    let value = e.target.value;
    if (e.target.type === 'checkbox') {
      //   value = e.target.checked;
      setCheckbox(!checkbox);
    }

  };
  return (
    <div className={containerClasses}>
      <label>
        <input
          type="checkbox"
          id={id}
          checked={checked}
          name={name}
          data-testid={'checkbox'}
          // data-testid={testID}
          // onChange={(e) => { handleChange(e); }}
          onChange={(e) => onChange()}
        />
        <span>
          {capitalizeFirstWord(spanValue)}
        </span>
      </label>
    </div>
  );
}

export const Checkbox = checkbox;
