/* eslint-disable no-console */
/* eslint-disable no-unused-vars */

import React, { useState } from 'react';
import { withTranslation } from 'react-i18next';
// styles
import './components-wrapper.scss';
/*********************reusable components import*****************************/
// header
import {
  Header,
  Input,
  Textarea,
  Button,
  Checkbox,
  Dropdown,
  DatePickerComp,
  RadioButtons,
  RadioButtonsListFilteration,
  DatePickers,
} from './';

const wrapperSep = {
  height: '2px',
  margin: '40px 0',
  border: '1px solid grey',
};

function componentsWrapper({
  t: translate,
}) {

  const [checkbox, setCheckbox] = useState(true);
  const [radioButtonValue, setRadioButtonValue] = useState(undefined);

  const handleChange = (e) => {
    let value = e.target.value;
    if (e.target.type === 'checkbox') {
      //   value = e.target.checked;
      setCheckbox(!checkbox);
    }

  };

  // dropdown arr
  const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },
  ];

  // datepicker data
  const [dateFilteration, setDateFilteration] = useState({
    from: '',
    to: '',
  });

  // single datepicker
  const [datepicker, setDatepicker] = useState('');


  return (
    <div className='wrapperContainer container'>

      {/* <div className="">
        <Dropzone />
      </div> */}
      <h1 className='title'>Form Template</h1>


      {/* <h2>header comp.</h2>
      <Header
        title={translate('header')}
        cancel={translate('cancel')}
        iconsBoolean={false}
        icons={''}
        classes={''} />

      <div style={wrapperSep} /> */}

      <h2>input</h2>
      <Input
        placeholder={'placeholder'}
        value={'value'}
        id={'id'}
        name={'name'}
        iconsBoolean
        icons={'fas fa-building'}
        classes={'form-control form-input-missing padding-left-40'}
        onChange={() => console.log('input on change')}
      />

      <div style={wrapperSep} />

      <h2>textarea</h2>
      <Textarea
        placeholder={'placeholder'}
        value={'value'}
        id={'id'}
        name={'name'}
        classes={'form-control descriptionTextArea'}
        onChange={() => console.log('textArea on change')}


      />

      <div style={wrapperSep} />

      <h2>button</h2>
      <Button
        value={'value'}
        iconsBoolean={false}
        icons={'fal fa-walking font-size-x-large font-size-sm-2x-large'}
        classes={'btn border-radius-0 btn-primary'}
        // eslint-disable-next-line no-console
        onClick={() => console.log('button clicked')}
      />

      <div style={wrapperSep} />

      <h2>checkbox</h2>
      <Checkbox
        containerClasses={'checkbox-container'}
        id="locationInput"
        testID="audit-round-summary-discussion"
        name='summaryDiscussion'
        spanValue="checkbox"
        checked={null}
        onChange={() => handleChange()}
      />
      <div style={wrapperSep} />

      <h2>radio buttons</h2>
      <RadioButtons
        className={'any-class'}
        id="locationInput"
        value={radioButtonValue}
        name='radi-buttons-group-name'
        options={[{ value: 'val1', label: 'label 1' }, { value: 'val2', label: 'label 2' }]}
        onChange={(e) => {
          setRadioButtonValue(e.target.value);
          // eslint-disable-next-line no-console
          console.log('name: ', e.target.name); console.log('value: ', e.target.value);

          console.log('type: ', typeof (e.target.value));
        }}
      />

      <div style={wrapperSep} />

      <h2>Dropdown</h2>
      <div className="form-group">
        <Dropdown
          options={options}
          value={'value'}
          placeholder={'placeholder'}
          iconsBoolean
          icons={'fas fa-building'}
        />
      </div>

      <h2>DatePicker</h2>
      <DatePickerComp
        classesWrapper={'form-group datePickerFromTo padding-0 d-flex'}
        fromDate={dateFilteration.from}
        toDate={dateFilteration.to}
      />

      <div style={wrapperSep} />

      <h2>single datePicker</h2>
      <DatePickers
        classesWrapper={'form-group datePickerFromTo padding-0 d-flex'}
        date={datepicker}
        onChange={(e) => setDatepicker(e)}
      />

      <div style={wrapperSep} />


      <h2>radioButtonsListFilteration</h2>
      <RadioButtonsListFilteration
        radioSelectedValue={'COMPANY_FILLING'}
        value1={'COMPANY_FILLING'}
        value2={'CONFIRMING'}
        value3={'COMPLETED'}
        value1_displayed={translate('COMPANY_FILLING')}
        value2_displayed={translate('CONFIRMING')}
        value3_displayed={translate('COMPLETED')}
        radioBtnsListIdentifier={'confirmSetStatus'}
        statusCount={{ 'COMPANY_FILLING': 1, 'CONFIRMING': 2, 'COMPLETED': 3 }}
        // eslint-disable-next-line no-console
        onChange={() => console.log('change happenes')}
      />


      <div style={wrapperSep} />

    </div>
  );
}

export const ComponentsWrapper = withTranslation()(componentsWrapper);
