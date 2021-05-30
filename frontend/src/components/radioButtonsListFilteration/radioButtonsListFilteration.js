import React from 'react';
import './radioButtonsListFilteration.scss';

export function RadioButtonsListFilteration({
  radioSelectedValue,
  onChange,
  value1,
  value2,
  value3,
  radioBtnsListIdentifier,
  value1_displayed,
  value2_displayed,
  value3_displayed,
  statusCount,
}) {

  //   const [confirmSetFilteration, setConfirmSetFilteration] = useState('companyFilling');

  //   const handleChange = (event) => {
  //     const { name, value } = event.target;
  //     setConfirmSetFilteration(value);

  //   };

  const labelSelected = (value) => {
    return radioSelectedValue === value && 'labelSelected';
  };

  const numberOfState = (value) => {
    return <span className='number-wrapper'>{value}</span>;
  };

  return (
    <div className='radioButtonsFilterationList'>

      <label className={`${labelSelected(value1)}`}>
        <input
          type='radio'
          checked={radioSelectedValue === value1}
          value={value1}
          name={radioBtnsListIdentifier}
          //   onChange={(e)=> handleChange(e)}
          onChange={(e) => onChange(e)}
        />
        <span>{value1_displayed}</span>
        {numberOfState(statusCount?.[value1] ? statusCount?.[value1] : 0)}
      </label>

      <label className={`${labelSelected(value2)}`}>
        <input
          type='radio'
          checked={radioSelectedValue === value2}
          value={value2}
          name={radioBtnsListIdentifier}
          //   onChange={(e)=> handleChange(e)}
          onChange={(e) => onChange(e)}

        />
        <span>{value2_displayed}</span>
        {numberOfState(statusCount?.[value2] ? statusCount?.[value2] : 0)}

      </label>

      {value3 &&

      <label className={`${labelSelected(value3)}`}>
        <input
          type='radio'
          checked={radioSelectedValue === value3}
          value={value3}
          name={radioBtnsListIdentifier}
          //   onChange={(e)=> handleChange(e)}
          onChange={(e) => onChange(e)}

        />
        <span>{value3_displayed}</span>
        {numberOfState(statusCount?.[value3] ? statusCount?.[value3] : 0)}

      </label>
      }

    </div>
  );
}

// export const =  RadioButtonsListFilteration;
