/* eslint-disable indent */
import React from 'react';
import DatePicker from 'react-datepicker';
import '../datePickerFromTo/datePickerFromTo.scss';


const datePicker = ({
    classesWrapper,
    date,
    onChange,
    name,
}) => {
    return (
        <div className={classesWrapper}>
            <div className='position-relative d-inline-block'>
                <div className='input-icon-left d-inline-block  bg-white'>
                    {/* eslint-disable-next-line max-len */}
                    <span className={'fal fa-calendar-alt icons-svg-alignment'} />
                </div>
                <div className='d-inline-block input-have-left-icon'>
                    <DatePicker
                        selected={date}
                        className="form-control min-height-100"
                        onChange={(e) => onChange(new Date(new Date(e).getTime() + (1000 * 60 * 60 * 24) - 1))}
                        dateFormat="d.M.yyyy"
                        name={name}
                    />
                </div>
            </div>
        </div>
    );
};

export const DatePickers = datePicker;
