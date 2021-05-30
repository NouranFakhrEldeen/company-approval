import React from 'react';
import { formatDate } from '../../helpers';

const viewFilters = ({
  searchInputValue,
  iconSearch,
  clearTextSearch,
  // dateFilteration,
  toDate,
  fromDate,
  inDeviationTime,
}) => {


  const FilterationDiv = (value, id) => {
    return <div className={'search-label-filteration'}>
      <div
        className='d-inline-block light bg-light-dark border-radius-12 margin-5 vertical-align-middle'>
        <span className='padding-5 padding-bottom-0 d-inline-block vertical-align-top'>
          <span className={iconSearch} />
        </span>
        <span
          className='padding-3-5 padding-top-3 d-inline-block vertical-align-top'>
          {value}
        </span>
        <span
          className={`padding-3-5 padding-top-3 d-inline-block
               vertical-align-top padding-right-10 border-left-1 border-white border-solid
               cursor-pointer-hover filter-icon-hover `}
          onClick={() => { clearTextSearch(value, id); }}>&#10005;</span>
      </div>


    </div>;
  };
  return (

    <div className='row margin-bottom-10'>
      {searchInputValue && FilterationDiv(searchInputValue, 'searchTerm')}

      {fromDate && FilterationDiv(formatDate('dd-mm-yyyy', fromDate), 'from')}

      {toDate && FilterationDiv(formatDate('dd-mm-yyyy', toDate), 'to') }
      {inDeviationTime && FilterationDiv(formatDate('dd-mm-yyyy', inDeviationTime), 'inDeviationTime') }

    </div>
  );
};

export const ViewFilters = viewFilters;
