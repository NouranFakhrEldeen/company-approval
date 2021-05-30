/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import {
  getConfirmSet, reviewSegmentItem, submitReviewConfirmSet,
  updateConfirmSegment, removeConfirmSetContact,
} from '../../redux/ConfirmSet';
import { useHistory } from 'react-router-dom';
import { Header, Button, ReviewSegment, AddPerson } from '../../components';
import { capitalizeFirstWord, formatDate } from '../../helpers';
import {
  CertificateServiceFactory,
} from '../../services';
import { Modal } from 'react-bootstrap';
import { toastr } from 'react-redux-toastr';
const certificateService = CertificateServiceFactory.getInstance();

function reviewConfirmSet({
  t: translate,
  submitReviewConfirmSet,
  reviewSegmentItem,
  updateConfirmSegment,
  confirmSet,
  id,
  REACT_loading,
  REACT_error,
  viewOnly,
  certificates,
  certificate,
  companyID,
  removeConfirmSetContact,
}) {
  const history = useHistory();
  const [confirmSetForm, setConfrimSetForm] = useState({});
  const [confrimSetMainData, setConfrimSetMainData] = useState({});
  const [formLoading, setFormLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [contactId, setContactId] = useState('');
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  useEffect(()=>{
    if (confirmSet.id !== id){
      return;
    }
    const temp = {
      id: confirmSet.id,
      certificates: confirmSet.certificates,
      segments: confirmSet.segments?.map((segment)=>({
        id: segment.id,
        type: segment.type,
        hasCertificate: segment.hasCertificate,
        checklistId: segment.checklistId,
        segmentId: segment.segmentId,
        name: segment.name,
        city: segment.city,
        postalCode: segment.postalCode,
        street: segment.street,
        addressAlias: segment.addressAlias,
        room: segment.room,
        status: segment.status,
        feedback: segment.feedback,
        items: segment.items?.map((item)=>({
          id: item.id,
          number: item.number,
          name: item.name,
          answer: item.answer,
          description: item.description,
          comment: item.comment,
        })),
      })),
    };
    if (confirmSet && !confirmSetForm?.id){
      setConfrimSetForm(temp);
      setConfrimSetMainData(JSON.parse(JSON.stringify(temp)));
    }
  }, [confirmSet]);
  const handleRemoveContact = ()=>{
    removeConfirmSetContact(id, contactId);
    handleClose();
  };
  useEffect(()=>{
    if (formLoading && !REACT_loading && !REACT_error){
      setFormLoading(false);
      return history.replace('/ConfirmSetList');
    } else if (formLoading && !REACT_loading){
      setFormLoading(false);
    }
  }, [REACT_loading]);

  const validateConfirmSet = () => {
    if (!confirmSetForm) return false;
    if (confirmSetForm?.segments && confirmSetForm?.segments?.find((segment)=> (segment.status === 'RETURNED'))){
      return false;
    }
    if (
      confirmSetForm?.segments &&
      !confirmSetForm?.segments.every((segment)=>(segment.status === 'APPROVED' || segment.status === 'AUDIT'))
    ){
      return false;
    }
    return true;
  };
  const handleSegmentChange = (segment, item) => {
    const mainSegment = confrimSetMainData.segments.find((mainSegment)=>(segment.id === mainSegment.id));
    if (item) {
      const mainItem = mainSegment.items?.find(it => it.id === item.id);
      if ((JSON.stringify(mainItem) !== JSON.stringify(item))) {
        reviewSegmentItem(confirmSet.id, segment.id, item.id, { ...item, id: undefined });
      }
    } else if ((JSON.stringify(segment) !== JSON.stringify(mainSegment)) && segment.status) {
      updateConfirmSegment(confirmSet.id, segment.id, { status: segment.status,
        feedback: segment.status === 'RETURNED' ? segment.feedback : undefined });
    }
    setConfrimSetForm({
      ...confirmSetForm,
      segments: confirmSetForm.segments.map((mainSegment)=>(segment.id === mainSegment.id ? segment : mainSegment)),
    });
  };
  const handleSendReport = (status)=>{
    setFormLoading(true);
    confirmSet?.id && submitReviewConfirmSet(confirmSet.id, status);
    {
      toastr.success('success', 'statment has been saved successfully');
    }
  };

  const debugBase64 = (base64URL) => {
    let win = window.open('');
    win.document.write(`<iframe src="${ base64URL }
    "frameborder="0" style="padding:0;margin:0;border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`);
  };

  const cancelRedirect = () => {
    if (window.location.href.indexOf('confirm-list') > -1) {
      history.push('/ConfirmSetList');
    } else {
      history.push(`/company/${companyID}`);
    }
  };


  const openReport = async (certificateID)=>{
    const response = await certificateService.getById(`${certificateID}`);
    debugBase64(`data:${response?.data?.contentType};base64,${response?.data?.file}`);
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


            {confirmSet.contacts?.length ? <p className='margin-0'>
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
            </p> : null }

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
      {confirmSet.certificates ? confirmSet.certificates.map((item, index)=>{
        return (
          <div className='answer-segment-component' key = {index}>
            <div className='card m-auto p-4'>
              <p>{capitalizeFirstWord(translate('existingCertificate'))}</p>
              <div>
                <div className="certificate-name" >
                  <p
                    className="certificate-title cursor-pointer"
                    onClick={()=> openReport(item)}>
                    <span className='margin-right-5'>{certificates?.find(cert => item === cert.id)?.name
                    || certificate.name}</span>
                    <i className="fal fa-external-link" />
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      }) : ''}
      {confirmSet.certificates ? confirmSet.certificates.map((item, index)=>{
      }) : ''}
      <div>
        { confirmSetForm?.segments?.map(((confirmSetSegment, i)=>
          <div key={`${confirmSetSegment.name}_${i}`}>
            <ReviewSegment
              confirmSetSegment={confirmSetSegment}
              onChange={handleSegmentChange}
              disabled={confirmSet.status !== 'CONFIRMING' || formLoading}
              confirmSetCertificates = {confirmSet.certificates}
            />
          </div>
        ))}
        <div className='padding-top-bottom-10'>
          {validateConfirmSet() ?
            <div className='display-inline-block padding-10 col-12 col-sm-auto'>
              {
                !viewOnly ?
                  <Button
                    disabled={formLoading || !validateConfirmSet() || confirmSet.status !== 'CONFIRMING'}
                    classes={'padding-5 border-0 confirm-set-answer-button'}
                    icons={'far fa-check'}
                    onClick={()=>handleSendReport(
                      confirmSet.segments.find((seg)=> seg.status === 'AUDIT') ? 'IN_AUDIT' : 'COMPLETED'
                    )}
                    iconsBoolean
                    value={capitalizeFirstWord(translate('save'))}
                  />
                  : ''
              }

            </div> : null}
          {confirmSetForm?.segments?.find((segment)=> (segment.status === 'RETURNED')) ?
            <div className='display-inline-block padding-10 col-12 col-sm-auto'>
              <Button
                disabled={formLoading || confirmSet.status !== 'CONFIRMING'}
                classes={'padding-5 border-0 confirm-set-answer-button'}
                icons={'far fa-undo'}
                onClick={()=>handleSendReport('COMPANY_FILLING')}
                iconsBoolean
                value={capitalizeFirstWord(translate('return_to_service_provider'))}
              /></div> : null}
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  confirmSet: state.confirmSets.confirmSet,
  REACT_loading: state.confirmSets.REACT_loading,
  REACT_error: state.confirmSets.error,
  certificates: state.confirmSets.confirmSet.certificatesObjects,
  certificate: state.confirmSets.certificate,
});

const mapDispatchToProps = (dispatch) => {
  return {
    updateConfirmSegment: (...props) => dispatch(updateConfirmSegment(...props)),
    getConfirmSet: () => dispatch(getConfirmSet()),
    reviewSegmentItem: (...props) => dispatch(reviewSegmentItem(...props)),
    submitReviewConfirmSet: (id, data) => dispatch(submitReviewConfirmSet(id, data)),
    removeConfirmSetContact: (...props) => dispatch(removeConfirmSetContact(...props)),
  };
};
export const ReviewConfirmSet = connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(reviewConfirmSet));
