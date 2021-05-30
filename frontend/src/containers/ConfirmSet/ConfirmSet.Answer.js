/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useCallback } from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Header, AnswerSegment, Button, DropZone, AddPerson } from '../../components';
import { capitalizeFirstWord, formatDate } from '../../helpers';
import * as _ from 'lodash';
import { toastr } from 'react-redux-toastr';
import { Modal } from 'react-bootstrap';
import {
  getConfirmSet,
  answerSegmentItem,
  updateConfirmSegmentMetadata,
  submitAnswerConfirmSet,
  duplicateSegment,
  createConfirmSetCertificate,
  updateConfirmSetCertificate,
  removeConfirmSetContact,
} from '../../redux/ConfirmSet';
function answerConfirmSet({
  t: translate,
  createConfirmSetCertificate,
  updateConfirmSetCertificate,
  answerSegmentItem,
  updateConfirmSegmentMetadata,
  submitAnswerConfirmSet,
  duplicateSegment,
  confirmSet,
  certificates,
  REACT_loading,
  REACT_error,
  certificate,
  companyID,
  id,
  removeConfirmSetContact,
  error,
}) {
  const history = useHistory();
  const [confirmSetForm, setConfrimSetForm] = useState({});
  const [confrimSetMainData, setConfrimSetMainData] = useState({});
  const [formLoading, setFormLoading] = useState(false);
  const [validFiles, setValidFiles] = useState([]);
  const [show, setShow] = useState(false);
  const [contactId, setContactId] = useState('');
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const onDrop = useCallback(acceptedFiles => {
    setValidFiles([...acceptedFiles]);
  }, []);
  useEffect(() => {
    for (let i = 0; i < validFiles.length; i++) {
      const formData = new FormData();
      const confirmSetId = confirmSet.id;
      const companyId = confirmSet.companyId;
      formData.append('file', validFiles[i]);
      formData.append('confirmSetId', confirmSetId);
      formData.append('companyId', companyId);
      createConfirmSetCertificate(formData);
    }
  }, [validFiles]);
  const handleRemoveContact = ()=>{
    removeConfirmSetContact(id, contactId);
    handleClose();
  };
  useEffect(() => {
    if (confirmSet.id !== id){
      return;
    }
    const temp = {
      id: confirmSet.id,
      certificates: confirmSet.certificates,
      segments: confirmSet.segments?.filter((segment)=>segment.status === 'RETURNED'
       || segment.status === 'PENDING').map((segment)=>({
        id: segment.id,
        type: segment.type,
        checklistId: segment.checklistId,
        segmentId: segment.segmentId,
        name: segment.name,
        city: segment.city,
        postalCode: segment.postalCode,
        street: segment.street,
        addressAlias: segment.addressAlias,
        room: segment.room,
        hasCertificate: segment.hasCertificate || false,
        items: segment.items?.map((item) => ({
          id: item.id,
          number: item.number,
          name: item.name,
          answer: item.answer,
          description: item.description,
          comment: item.comment,
        })),
      })),
    };
    if (confirmSet &&
      (!confirmSetForm?.id || confirmSet.segments?.filter((segment)=>segment.status === 'RETURNED'
      || segment.status === 'PENDING')
        .length !== confrimSetMainData?.segments.length)
    ){
      setConfrimSetForm(temp);
      setConfrimSetMainData(JSON.parse(JSON.stringify(temp)));
    }
  }, [confirmSet]);

  useEffect(() => {
    if (formLoading && !REACT_loading && !REACT_error) {
      setFormLoading(false);
      return history.replace('/ConfirmSetList');
    }
  }, [REACT_loading]);

  const validateItem = (item) => {
    return (item.answer === 'YES' || item.answer === 'NO' && item.description);
  };
  const validateSegment = (segment) => {
    return segment.type === 'ADDRESS' &&
      (segment.city?.length && /^\d{5}$/.test(segment.postalCode) && segment.street?.length)
      ||
      segment.type === 'ROOM' &&
      (segment.city?.length && /^\d{5}$/.test(segment.postalCode) && segment.street?.length && segment.room)
      ||
      segment.type === 'NORMAL';
  };
  const validateConfirmSet = () => {
    if (!confirmSetForm) return false;
    if (confirmSetForm?.segments){
      for (const segment of confirmSetForm.segments) {
        if (!segment.hasCertificate)
          if (!!segment.items?.find((item)=> (
            !validateItem(item))) || (!validateSegment(segment))) {
            return false;
          }
      }
    }
    return true;
  };
  useEffect(() => {
    if (!_.isEmpty(certificate)){
      let data = [];
      data.push(certificate.id);
      updateConfirmSetCertificate(confirmSet.id, data);

      setConfrimSetForm({
        ...confirmSetForm,
        certificates: confirmSetForm.certificates ? [...confirmSetForm.certificates, certificate.id] : [certificate.id],
      });

    }
  }, [certificate]);
  const handleSegmentChange = (segment, item) => {
    const mainSegment = confrimSetMainData.segments.find((mainSegment) => (segment.id === mainSegment.id));
    if (item) {
      const mainItem = mainSegment.items?.find(it => it.id === item.id);
      if ((JSON.stringify(mainItem) !== JSON.stringify(item)) && validateItem(item)) {
        answerSegmentItem(confirmSet.id, segment.id, item.id, { ...item, id: undefined });
      }
    } else if ((JSON.stringify(segment) !== JSON.stringify(mainSegment)) && validateSegment(segment)) {
      updateConfirmSegmentMetadata(confirmSet.id, segment.id, { ...segment, id: undefined });
    }
    setConfrimSetForm({
      ...confirmSetForm,
      segments: confirmSetForm.segments.map((mainSegment) => (segment.id === mainSegment.id ? segment : mainSegment)),
    });
  };
  const handleSendReport = () => {
    setFormLoading(true);
    confirmSet?.id && submitAnswerConfirmSet(confirmSet.id);
    if (confirmSet && !error)
    {
      toastr.success('success', 'statment has been sent successfully');
    }
  };


  const cancelRedirect = () => {
    if (window.location.href.indexOf('confirm-list') > -1) {
      history.push('/ConfirmSetList');
    } else {
      history.push(`/company/${companyID}`);
    }
  };

  return (
    <div className='confirm-set-answer-container'>
      <Header
        title={translate('verification_of_security_procedures')}
        cancel={translate('cancel')}
        cancelBoolean
        cancelLinkFunction={(()=> cancelRedirect())}
        iconsBoolean={false}
        icons={''}
        classes={''} />
      <div className='padding-10 confirm-set-info'>
        <div className= "row margin-0 w-100">
          <div className= "col-lg-5 col-md-6">
            <p className='margin-0'>

              {capitalizeFirstWord(translate('verification_initiated'))}
          &nbsp;
              {formatDate('dd.mm.yyyy', confirmSet.startTime)}.
          &nbsp;
              {capitalizeFirstWord(translate('changes_are_saved_automatically'))}.
            </p>


            {confirmSet.contacts?.length ? <div className='margin-0'>
              {capitalizeFirstWord(translate('cast'))},
          &nbsp;

              {capitalizeFirstWord(translate('who_have_the_right_to_process_this_form'))}:
          &nbsp;

              {confirmSet.contacts?.map((contact, index)=>{
                return (
                  <div key={`${contact.email}_${index}`} >


                    <span >
                      {contact.name}
                &nbsp;
                (<a href={`mailto: ${contact.email}`}>{contact.email}</a>)
                      {/* {index + 1 === confirmSet.contacts?.length ? '.' : ','} */}

                      <span className="icon">
                        <i className="far fa-trash-alt" onClick={()=>{handleShow(); setContactId(contact.id);}} />
                      </span>
                    </span>
                  </div>

                );
              })}
            </div> : null }

          </div>
          <Modal centered show={show} onHide={handleClose}>

            <Modal.Body>

              {/* <i className="far fa-exclamation-triangle" /> */}
              <h5> {translate('Are_you_sure_you_wish_to_delete_this_item')}</h5></Modal.Body>
            <Modal.Footer>
              <Button
                value={capitalizeFirstWord(translate('yes'))}
                iconsBoolean
                icons={'far fa-check'}
                classes={'btn border-radius-0 btn-primary margin-bottom-15 btn-primary-disabled'}
                onClick={() => handleRemoveContact()}

              />

              <Button
                value={capitalizeFirstWord(translate('no'))}
                iconsBoolean
                icons={'fal fa-times '}
                classes={'btn border-radius-0 btn-primary margin-bottom-15 btn-primary-disabled'}
                onClick={() => handleClose()}

              />

            </Modal.Footer>
          </Modal>
          <AddPerson confirmSetId= {confirmSet?.id}/>
        </div>
      </div>
      <div className='answer-segment-component'>
        <div className='card m-auto p-4'>
          <h4>{capitalizeFirstWord(translate('existingCertificate'))}</h4>
          <DropZone onDrop={onDrop} accept={'application/pdf, image/*'} multiple = {false} />
          {validFiles ? validFiles.map((item, index)=>{
            return (
              <div key={index}>

                {(item.name)}
              </div>
            );
          }) :
            ''
          }
          <div >
            {confirmSet.certificates ? <p>{capitalizeFirstWord(translate('existingCertificate'))}</p> : null }
            {confirmSet.certificates && certificates?.length ? confirmSet.certificates.map((item, index)=>{
              return (
                <div key = {index}>
                  <div className="certificate-name" >

                    <p className="certificate-title">
                      {certificates?.find(cert => item === cert.id)?.name || item.name
                      }<i className="fal fa-external-link" />
                    </p>
                  </div>
                </div>
              );
            }) : ''}
          </div>
          {/* create certificate */}
          {/* create handler to update confirm set after getting certificate id  */}
          {/* send array for certeficates  */}
          {/* show  certificates from confiremSet  */}


          {/* TODO:  radio button with true value check if certificate exist  */}
        </div>
      </div>
      <div>
        { confirmSetForm?.segments?.map(((confirmSetSegment, i)=>
          <div key={`${confirmSetSegment.name}_${i}`}>
            <AnswerSegment
              certificates={confirmSetForm?.certificates}
              confirmSetSegment={confirmSetSegment}
              onChange={handleSegmentChange}
              disabled={confirmSet.status !== 'COMPANY_FILLING' || formLoading}
            />
            {confirmSet.status === 'COMPANY_FILLING' && confirmSetSegment?.type !== 'NORMAL' &&
              <div className={'create-new-segment-container'}>
                <div className='create-new-segment-buttons'>
                  <div
                    className='padding-5 d-inline-block col-12 col-sm-auto'
                    key={`${confirmSetSegment.name}_button_${i}`}>
                    <Button
                      disabled={formLoading}
                      classes={'padding-5 border-0 confirm-set-add-button width-100'}
                      icons={'far fa-plus'}
                      onClick={()=>{duplicateSegment(confirmSet.id, confirmSetSegment.id);}}
                      iconsBoolean
                      value={`${capitalizeFirstWord(translate('new'))} ${confirmSetSegment.name}`}
                    />
                  </div>
                </div>
              </div>}
          </div>
        ))}
        {/* {confirmSet.status === 'COMPANY_FILLING' &&
          confirmSetForm?.segments?.filter((seg)=> seg.type !== 'NORMAL').length ?
          <div className={'create-new-segment-container'}>
            <div className='create-new-segment-buttons'>
              {confirmSetForm?.segments.filter((seg)=> seg.type !== 'NORMAL')?.filter((value, index, self) => {
                return self.findIndex(v => v.name === value.name) === index;
              }).map((confirmSetSegment, i)=>(
                <div
                  className='padding-5 d-inline-block col-12 col-sm-auto'
                  key={`${confirmSetSegment.name}_button_${i}`}>
                  <Button
                    disabled={formLoading}
                    classes={'padding-5 border-0 confirm-set-add-button width-100'}
                    icons={'far fa-plus'}
                    onClick={()=>{duplicateSegment(confirmSet.id, confirmSetSegment.id);}}
                    iconsBoolean
                    value={`${capitalizeFirstWord(translate('new'))} ${confirmSetSegment.name}`}
                  />
                </div>
              ))}
            </div>
          </div> : null} */}
        <div className='padding-10'>
          <Button
            disabled={formLoading || !validateConfirmSet() || confirmSet.status !== 'COMPANY_FILLING'}
            classes={'padding-5 border-0 confirm-set-answer-button col-12 col-sm-auto'}
            icons={'far fa-check'}
            onClick={handleSendReport}
            iconsBoolean
            value={capitalizeFirstWord(translate('send_statement'))}
          />
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  confirmSet: state.confirmSets.confirmSet,
  REACT_loading: state.confirmSets.REACT_loading,
  REACT_error: state.confirmSets.error,
  certificate: state.confirmSets.certificate,
  certificates: state.confirmSets.confirmSet.certificatesObjects,
  error: state?.confirmSets?.error,
});

const mapDispatchToProps = (dispatch) => {
  return {
    removeConfirmSetContact: (...props) => dispatch(removeConfirmSetContact(...props)),
    getConfirmSet: () => dispatch(getConfirmSet()),
    updateConfirmSegmentMetadata: (...props) => dispatch(updateConfirmSegmentMetadata(...props)),
    answerSegmentItem: (...props) => dispatch(answerSegmentItem(...props)),
    submitAnswerConfirmSet: (id, data) => dispatch(submitAnswerConfirmSet(id, data)),
    duplicateSegment: (...props) => dispatch(duplicateSegment(...props)),
    createConfirmSetCertificate: (data)=> dispatch(createConfirmSetCertificate(data)),
    updateConfirmSetCertificate: (id, data)=> dispatch(updateConfirmSetCertificate(id, data)),
  };
};
export const AnswerConfirmSet = connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(answerConfirmSet));
