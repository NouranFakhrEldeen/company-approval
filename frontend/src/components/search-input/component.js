import React, { useEffect, useState, forwardRef } from 'react';
import { useTranslation } from 'react-i18next';


import { capitalizeFirstWord } from '../../helpers';

const searchInput = forwardRef(({
  handleSearch,
  placeholder,
  timeout,
  name,
  className,
  iconsBoolean,
  icons,

}, ref) => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, timeout || 500);
  useEffect(
    () => {
      handleSearch(debouncedSearchTerm);
    },
    // eslint-disable-next-line
    [debouncedSearchTerm]
  );


  const { t: translate } = useTranslation();

  return (
    <div className='input-field-container'>
      {iconsBoolean && <span className='input-icon-cont'>
        <span className={icons} />
      </span>}
      <input
        ref={ref}
        className={className}
        name={name}
        placeholder={placeholder || `${capitalizeFirstWord(translate('search'))}...`}
        onChange={e => setSearchTerm(e.target.value)}
      />
    </div>
  );
});

export const SearchInput = searchInput;

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
    // eslint-disable-next-line
  }, [value]);
  return debouncedValue;
}