import React from 'react';

// filerations components
import {
  Dropdown,
  DatePickerComp,
  RadioButtonsListFilteration,
} from '../../components';
// helpers
// react
import { capitalizeAllWords } from '../../helpers';

// react
import { withTranslation } from 'react-i18next';
function deviationFilteration({
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
      <div className="form-group left-nav-radioList-filteration">
        <h3>{capitalizeAllWords(translate('status'))}</h3>
        <RadioButtonsListFilteration
          radioSelectedValue={radioSelectedValue}
          onChange={onChange}
          value1={'IN_DEVIATION_FIXING'}
          value2={'IN_DEVIATION_PROCESSING'}
          value1_displayed={translate('deviation_fixing')}
          value2_displayed={translate('deviation_PROCESSING')}

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

export const DeviationFilteration = withTranslation()(deviationFilteration);
