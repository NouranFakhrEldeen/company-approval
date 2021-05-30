import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { Input } from '../../../components';
import { withTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
const contact = ({ state, setState, disable, t: translate }) => {
  const validationSchema = Yup.object().shape({
    name: Yup.string().required('service Provider is required'),
    email: Yup.string().required('email is required'),
    phone: Yup.string().required('phone is required'),
  });
  const { register, errors } = useForm({
    resolver: yupResolver(validationSchema),
  });
  const handleContactChange = (event) => {
    const { name, value } = event.target;
    setState({
      ...state,
      [name]: value,
    });
  };
  return (
    <div className='margin-bottom-25 contact-form'>
      <Row className="mb-2">
        <Col className="col-md-8 col-sm-10 contact-form-cont ">
          <Input
            type={'text'}
            // placeholder={'placeholder'}
            placeholder={translate('contact_person_at_service_provider')}
            name={'name'}
            iconsBoolean
            icons={'fas fa-user'}
            classes={`form-control form-input-missing padding-left-40 margin-bottom-15 ${errors.name ? 'is-invalid' : ''
              }`}
            onChange={(e) => handleContactChange(e)}

            value={state.name}
            ref={register}
            disabled={disable}
          />
          <span className='fas fa-asterisk required contact-form-name-icon' style={{ color: '#ff741a' }} />
          {errors.name && <span>{errors.name.message}</span>}
        </Col>
      </Row>
      <Row className="mb-2 row-inputs-wrapper">
        <div className="col-md-5 col-sm-10 contact-form-cont">
          <Input
            value={state.email}
            type={'text'}
            placeholder={translate('Email')}
            name={'email'}
            iconsBoolean
            icons={'fas fa-envelope'}
            classes={`form-control form-input-missing padding-left-40 ${errors.email ? 'is-invalid' : ''
              }`}
            onChange={(e) => handleContactChange(e)}
            ref={register}
            disabled={disable}
          />
          <span className='fas fa-asterisk required contact-form-name-icon' style={{ color: '#ff741a' }} />

          {errors.email && <span>{errors.email.message}</span>}
        </div>
        <div className="col-md-5 col-sm-10 contact-form-cont">
          <Input
            value={state.phone}
            type={'text'}
            placeholder={translate('Phone')}
            name={'phone'}
            iconsBoolean
            icons={'fas fa-phone'}
            classes={`form-control form-input-missing padding-left-40 ${errors.phone ? 'is-invalid' : ''
              }`}
            onChange={(e) => handleContactChange(e)}
            ref={register}
            disabled={disable}
          />
          <span className='fas fa-asterisk required contact-form-name-icon' style={{ color: '#ff741a' }} />

          {errors.phone && <span>{errors.phone.message}</span>}
        </div>
      </Row>
    </div>
  );
};
const Contact = (withTranslation()(contact));
// eslint-disable-next-line no-unused-vars
const useContact = ({ type, disable }) => {
  const [state, setState] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'CONTACT',
  });
  // eslint-disable-next-line no-unused-vars
  // eslint-disable-next-line react/jsx-key
  return [
    state,
    <Contact key={''} state={state} setState={setState} disable={disable} />,
    setState,
  ];
};
export const useContactComp = useContact;
