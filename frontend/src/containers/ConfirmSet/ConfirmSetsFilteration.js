import React from 'react';

// filerations components
import {
  RadioButtonsListFilteration,
  Dropdown,
  DatePickerComp,
} from '../../components';

// helpers
import { capitalizeAllWords } from '../../helpers';

// react
import { withTranslation } from 'react-i18next';


function confirmSetsFilteration({
  radioSelectedValue,
  t: translate,
  onChange,
  statusCount,
  options,
  value,
  placeholder,
  name,
  applyFilter,
  classesWrapper,
  fromDate,
  toDate,
  datePickerFromOnChange,
  datePickerToOnChange,
}) {
  return (
    <div>

      <div className='form-group left-nav-radioList-filteration'>
        <h3>
          {capitalizeAllWords(translate('status'))}
        </h3>
        <RadioButtonsListFilteration
          radioSelectedValue={radioSelectedValue}
          onChange={onChange}
          value1={'COMPANY_FILLING'}
          value2={'CONFIRMING'}
          value3={'COMPLETED'}
          value1_displayed={translate('COMPANY_FILLING')}
          value2_displayed={translate('CONFIRMING')}
          value3_displayed={translate('COMPLETED')}
          radioBtnsListIdentifier={'confirmSetStatus'}
          statusCount={statusCount}
        />

      </div>

      <div className="form-group padding-top-10">
        <Dropdown
          options={options}
          value={value}
          placeholder={placeholder}
          iconsBoolean
          icons={'fas fa-building'}
          name={name}
          applyFilter={applyFilter}
        />
      </div>

      <DatePickerComp
        classesWrapper={classesWrapper}
        fromDate={fromDate}
        toDate={toDate}
        datePickerFromOnChange={datePickerFromOnChange}
        datePickerToOnChange={datePickerToOnChange}

      />

    </div>
  );
}

export const ConfirmSetsFilteration = (withTranslation()(confirmSetsFilteration));
