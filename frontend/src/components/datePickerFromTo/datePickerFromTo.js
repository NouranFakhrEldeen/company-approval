import React from 'react';
import DatePicker from 'react-datepicker';
import './datePickerFromTo.scss';

function datePickerComp({
  classesWrapper,
  fromDate,
  toDate,
  datePickerFromOnChange,
  datePickerToOnChange,
}) {
  return (
    <div className={classesWrapper}>
      <div className='position-relative d-inline-block'>
        <div className='input-icon-left d-inline-block  bg-white'>
          {/* eslint-disable-next-line max-len */}
          <span className={'fal fa-calendar-alt icons-svg-alignment'} />
        </div>
        <div className='d-inline-block input-have-left-icon'>
          <DatePicker
            selected={fromDate}
            className="form-control min-height-100"
            onChange={(e) => datePickerFromOnChange(e)}
            dateFormat="d.M.yyyy"
            name='from'
            data-testid={'datePicker1'}

          />
        </div>
      </div>
      <div className='position-relative d-inline-block'>
        <div className='input-icon-left d-inline-block bg-white border-left-0'>
          {/* eslint-disable-next-line max-len */}
          <span className={'fas fa-minus margin-left-2'} />
        </div>
        <div className='d-inline-block input-have-left-icon'>
          <DatePicker
            selected={toDate}
            className="form-control min-height-100"
            onChange={(e) => datePickerToOnChange(new Date(new Date(e).getTime() + (1000 * 60 * 60 * 24) - 1))}
            dateFormat="d.M.yyyy"
            name='to'
          />
        </div>
      </div>
    </div>
  );
}

export const DatePickerComp = datePickerComp;