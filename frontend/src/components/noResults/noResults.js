import React from 'react';
import { capitalizeFirstWord } from '../../helpers';


function NoResults({
  value,
}) {
  return (
    <div data-testid='noResults'
    >
      <h4
        className='text-center no-results' >
        {capitalizeFirstWord(value)}
      </h4>
    </div>
  );
}

export default NoResults;
