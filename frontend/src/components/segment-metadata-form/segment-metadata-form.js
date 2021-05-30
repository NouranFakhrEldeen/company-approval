import React, { useEffect, useState, useRef } from 'react';
import { capitalizeFirstWord } from '../../helpers';
import './segment-metadata-form.scss';
import { DelayedInput } from '../';
import { withTranslation } from 'react-i18next';

const segmentMetaDataForm = ({
  segment,
  type,
  onChange,
  t: translate,
  disabled,
}) => {
  const [formInputs, setFormInputs] = useState({});
  let roomRef = useRef(null);
  let cityRef = useRef(null);
  let postalCodeRef = useRef(null);
  let streetRef = useRef(null);

  useEffect(()=>{
    switch (type){
    case 'NORMAL':
      setFormInputs({});
      break;
    case 'ADDRESS':
      setFormInputs({ addressAlias: true, city: true, postalCode: true, street: true });
      break;
    case 'ROOM':
      setFormInputs({ room: true, city: true, postalCode: true, street: true });
      break;
    }
  }, [type]);

  return (
    <div className='segment-metadata-form-component d-flex flex-wrap'>
      {formInputs.addressAlias ?
        <div className='col-12 col-sm-6 col-md-4 col-lg-3 input-container'>
          <DelayedInput
            disabled={disabled}
            placeholder={capitalizeFirstWord(translate('address_alias'))}
            delay={1000}
            value={segment.addressAlias}
            className='text-input w-100 ml-sm-1'
            type='text'
            name='addressAlias'
            onChange={onChange}
          />
        </div>
        : null
      }
      {formInputs.room ?
        <div className='col-12 col-sm-6 col-md-4 col-lg-3 input-container'>
          <DelayedInput
            disabled={disabled}
            ref={roomRef}
            delay={1000}
            placeholderOverlay={{ message: capitalizeFirstWord(translate('room')), required: true }}
            className='text-input w-100 ml-sm-1'
            type='text'
            value={segment.room}
            name='room'
            onChange={onChange}
          />
        </div>
        : null
      }
      {formInputs.street ?
        <div className='col-12 col-sm-6 col-md-4 col-lg-3 input-container'>
          <DelayedInput
            disabled={disabled}
            ref={streetRef}
            delay={1000}
            icon={'fas fa-map-marker-alt'}
            placeholderOverlay={{ message: capitalizeFirstWord(translate('street_address')), required: true }}
            className='text-input w-100 ml-sm-1'
            type='text'
            value={segment.street}
            name='street'
            onChange={onChange}
          />
        </div>
        : null
      }
      {formInputs.city ?
        <div className='col-12 col-sm-6 col-md-4 col-lg-3 input-container'>
          <DelayedInput
            disabled={disabled}
            ref={cityRef}
            delay={1000}
            placeholderOverlay={{ message: capitalizeFirstWord(translate('city')), required: true }}
            className='text-input w-100 ml-sm-1'
            type='text'
            value={segment.city}
            name='city'
            onChange={onChange}
          />
        </div>
        : null
      }
      {formInputs.postalCode ?
        <div className='col-12 col-sm-6 col-md-4 col-lg-3 input-container'>
          <DelayedInput
            disabled={disabled}
            ref={postalCodeRef}
            delay={1000}
            placeholderOverlay={{ message: capitalizeFirstWord(translate('postal_code')), required: true }}
            // className='text-input w-100 ml-sm-1'
            className={`text-input w-100 ml-sm-1 ${ /^\d{5}$/.test(segment.postalCode) ? '' : 'error'}`}
            type='text'
            value={segment.postalCode}
            name='postalCode'
            onChange={onChange}
          />
          {!(/^\d{5}$/.test(segment.postalCode)) && <span className="error-message">{translate('postal_code_error_message')}</span>}
        </div>
        : null
      }
    </div>
  );
};
export const SegmentMetaDataForm = withTranslation()(segmentMetaDataForm);
