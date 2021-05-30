import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { Button, Input } from '../../../components';
import { withTranslation } from 'react-i18next';
import { capitalizeFirstWord } from '../../../helpers';
const notifyContact = ({ onHandle, type, disable, t: translate }) => {
  const [state, setState] = useState({
    name: '',
    email: '',
    phone: '',
    type: '',
  });
  useEffect(() => {
    if (state.type === '')
      setState({ ...state, type });
  }, [state]);

  const { register } = useForm();
  const handleContactChange = (event) => {
    const { name, value } = event.target;
    setState({
      ...state,
      [name]: value,
    });
  };

  return (
    <div className='contact-form'>
      <Row className="mb-2">
        <Col className='col-md-8 col-sm-10 '>
          <Input
            ref={register}
            type={'text'}
            placeholder={translate('person_to_notify')}
            name={'name'}
            iconsBoolean
            icons={'fas fa-user'}
            classes={'form-control form-input-missing padding-left-40 margin-bottom-15'}
            onChange={(e) => handleContactChange(e)}
            value={state.name}
            autoFocus
            disabled={disable}
          />
        </Col>
      </Row>
      <Row className="mb-2 margin-bottom-20-important row-inputs-wrapper">
        <div className='col-md-5 col-sm-10 '>

          <Input
            value={state.email}
            type={'text'}
            placeholder={translate('Email')}
            name={'email'}
            iconsBoolean
            icons={'fas fa-envelope'}
            classes={'form-control form-input-missing padding-left-40'}
            onChange={(e) => handleContactChange(e)}
            disabled={disable}
          />
        </div>
        <div className='col-md-5 col-sm-10 '>

          <Input
            value={state.phone}
            type={'text'}
            placeholder={translate('Phone')}
            name={'phone'}
            iconsBoolean
            icons={'fas fa-phone'}
            classes={'form-control form-input-missing padding-left-40'}
            onChange={(e) => handleContactChange(e)}
            disabled={disable}
          />
        </div>
      </Row>
      {/* <div className="sepatator" /> */}
      <Button
        value={capitalizeFirstWord(translate('add'))}
        iconsBoolean
        icons={'fas fa-plus '}
        classes={'btn border-radius-0 btn-primary margin-bottom-15 btn-primary-disabled'}
        onClick={() => onHandle(state)}
        disabled={disable}
      />
    </div>
  );
};
export const NotifyContact = (withTranslation()(notifyContact));