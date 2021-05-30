import React, { useState } from 'react';
import { Button, Input } from '../../components';
import { Modal, Row, Col } from 'react-bootstrap';
import { capitalizeFirstWord } from '../../helpers';
import { withTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { connect } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import './add-person.scss';
import { addConfirmSetContact } from '../../redux/ConfirmSet';
function addPerson({ t: translate, addConfirmSetContact, confirmSetId }) {
  const [show, setShow] = useState(false);
  const [state, setState] = useState({});
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const validationSchema = Yup.object().shape({
    name: Yup.string().required('name is required'),
    // email: Yup.string().email('not vaild mail ').required('email is required'),
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
  const onHandle = () => {
    addConfirmSetContact(confirmSetId, state);
    handleClose();
  };

  return (
    <div className="">
      <Button
        onClick={() => handleShow()}
        classes={'padding-5 border-0 add-contact-button'}
        icons={'far fa-user-plus'}
        iconsBoolean
        value={capitalizeFirstWord(translate('addPerson'))}
      />
      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {translate('add_a_person_to_process_the_statement')}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <span>
            {translate(
              'The_invitation_to_process_the_report_is_sent_in_connection_with_the_addition'
            )}
          </span>
          <div className="contact-form">
            <Row className="mb-2 mt-3">
              <Col className="col-md-8 col-sm-10 ">
                <Input
                  type={'text'}
                  placeholder={translate('name')}
                  name={'name'}
                  iconsBoolean
                  icons={'fas fa-user'}
                  classes={
                    'form-control form-input-missing padding-left-40 margin-bottom-15 '
                  }
                  onChange={(e) => handleContactChange(e)}
                  value={state.name}
                  ref={register}
                />
              </Col>
            </Row>
            <Row className="mb-2 ">
              <div className="col-md-8 col-sm-10 ">
                <Input
                  value={state.email}
                  type={'text'}
                  placeholder={translate('Email')}
                  name={'email'}
                  iconsBoolean
                  icons={'fas fa-envelope'}
                  classes={`form-control form-input-missing padding-left-40 ${
                      errors.email ? 'is-invalid' : ''
                    }`}
                  onChange={(e) => handleContactChange(e)}
                />
                {errors.email && <span>{errors.email.message}</span>}
              </div>
            </Row>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            value={capitalizeFirstWord(translate('add'))}
            iconsBoolean
            icons={'fas fa-plus '}
            classes={
              'btn border-radius-0 btn-primary margin-bottom-15 btn-primary-disabled'
            }
            onClick={() => onHandle()}
            disabled={state.name == undefined || state.email == undefined}
          />
        </Modal.Footer>
      </Modal>
    </div>
  );
}
const mapStateToProps = (state) => {
  return {
    contact: state?.confirmSets?.contact,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addConfirmSetContact: (id, data) =>
      dispatch(addConfirmSetContact(id, data)),
  };
};

export const AddPerson = connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(addPerson));
