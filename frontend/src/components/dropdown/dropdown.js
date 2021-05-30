import React from 'react';
import Select from 'react-select';
import './dropdown.scss';
import { capitalizeFirstWord } from '../../helpers';


function dropdown({
  options,
  value,
  placeholder,
  iconsBoolean,
  icons,
  name,
  applyFilter,

}) {

  return (
    <div className='dropDown-container d-flex'>
      <div className='dropDown-icon-left d-inline-block' >
        {iconsBoolean && (
          <span className="dropDown-icon-cont">
            <span className={icons} />
          </span>
        )}
      </div>
      <Select
        className='d-inline-block input-with-left-icon'
        isClearable = {false}
        isSearchable
        name={name}
        placeholder={capitalizeFirstWord(placeholder)}
        onChange={(e, { action })=>applyFilter(e, action)}
        value={value}
        options={options}
        data-testid={'dropdown'}
      />
    </div>
  );
}

export const Dropdown = dropdown;