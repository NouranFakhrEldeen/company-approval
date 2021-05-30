import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Header, AuthImg, RadioButtons, Textarea, Button, Feedback } from '../../components';
import { capitalizeFirstWord } from '../../helpers';
import {
  getDeviation,
  uploadDeviationImage,
  submitReview,
  getDeviationImage,
} from '../../redux/deviation';
import { AuthenticationServiceFactory } from '../../services';
import * as Roles from '../../shared/role.constant';
import { toastr } from 'react-redux-toastr';
const authorizationService = AuthenticationServiceFactory.getInstance();

function deviationReview({
  deviation,
  t: translate,
  submitReview,
  hasRole,
}) {
  let history = useHistory();
  let TextareaInput = useRef(null);

  const isImageUploaded = (img) => {
    return !(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i.test(img));
  };
  const [deviationForm, setDeviationForm] = useState({});


  const handleTextAreaChange = (event) => {
    const { name, value } = event.target;
    setDeviationForm({
      ...deviationForm,
      [name]: value,
    });
  };
  const handleSendReport = () => {
    deviation?.id && submitReview(deviation?.id, deviationForm);
    if (deviation)
    {
      toastr.success('success', 'statment has been sent successfully');
    }
    history.replace(`/confirm-set/${deviationForm.confirmSetId}/deviations`);
  };

  useEffect(() => {
    const temp = {
      id: deviation?.id,
      confirmSetId: deviation?.confirmSetId,
      status: deviation?.status,
      images: deviation?.images,
      howItWasFixed: deviation?.feedbackHistory?.find(
        feedback => feedback.retryNo === deviation.retryNo
      )?.howItWasFixed || '',
      comment: deviation?.feedbackHistory?.find(
        feedback => feedback.retryNo === deviation.retryNo
      )?.comment || '',
    };
    if (deviation) {
      setDeviationForm({ ...temp });
    }
  }, [deviation]);


  const handleStatusChange = (event) =>{
    const { name, value } = event.target;
    if (deviationForm[event.target.name] !== event.target.value)
      setDeviationForm({
        ...deviationForm,
        [name]: value,
      });
  };
  return (
    <div >
      <Header
        title={translate('Deviation')}
        cancel={translate('cancel')}
        cancelBoolean
        cancelLinkFunction={() =>
          history.push(`/confirm-set/${deviation?.confirmSetId}/deviations`)
        }
        iconsBoolean={false}
        icons={''}
        classes={''}
      />
      <div className="deviation-container">
        <div className="status">
          <div className="">
            {deviation?.status === 'APPROVED' ? (
              <span className="approve">
                <i className="far fa-check" />
                {translate('APPROVED')}
              </span>
            ) : deviation?.status === 'IN_FIXING' || deviation?.status === 'RETURN_IN_FIXING' ? (
              <div>
                <span className="reaudit">
                  <i className="fas fa-wrench" />
                  {translate('in_fixing')}
                </span>
              </div>
            ) : deviation?.status === 'WAITING_APPROVE' ? (
              <div>
                <span className="reaudit">
                  <i className="far fa-clock" />
                  {translate('WAITING_APPROVE')}
                </span>
              </div>
            ) : deviation?.status === 'REAUDIT' ? (
              <div>
                <span className="reaudit">
                  <i className="fas fa-undo" />
                  {translate('REAUDIT')}
                </span>
              </div>
            ) : (
              ''
            )}
          </div>
        </div>
        <div className="companies-list margin-top-20">
          <div className="row margin-0">
            <div className="result-container col-12 padding-right-20-important">
              <div className="wrapper">
                <div className="list-group-item">
                  <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <p>
                        {' '}
                        <span className='d-inline-block'>{deviation?.number}</span>
                        <span className='d-inline-block margin-left-10'>{deviation?.item}</span>
                      </p>
                      <div className="sepatator" />
                      <p> {translate('how_to_fix_it')} </p>
                      <p>{deviation?.howToFix}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="companies-list margin-top-20">
          {
            (deviation?.howItWasFixed || deviation?.images) &&
            <div className="row margin-0">
              <div className="result-container col-12 padding-right-20-important">
                <div className="wrapper">
                  <div className="list-group-item">
                    <div className="row">
                      <div className="col-lg-12 col-md-12 col-sm-12" >
                        <Feedback
                          title = {'previous comments'}
                          historylist = {
                            JSON.parse(JSON.stringify(deviation?.feedbackHistory ? deviation?.feedbackHistory : []))
                              .map((feed)=> {
                                if (feed.retryNo === deviation.retryNo){
                                  delete feed.comment;
                                }
                                return feed;
                              })}
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-12 col-md-12 col-sm-12">
                        {/* <span>{translate('comment_on_correction')}</span>
                        <p>{deviation?.howItWasFixed}</p> */}
                        {deviation?.images
                          ? deviation.images.map((image, i) => {
                            return (
                              <AuthImg
                                key={`${deviation._id}_image_${i}`}
                                className='width-50 h-75 vertical-align-top'
                                imgId={isImageUploaded(image) ? image : undefined}
                                src={isImageUploaded(image) ? undefined : image}
                                alt='preview'
                              />
                            );
                          })
                          : ''}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          }

          <div className="companies-list margin-top-20 deviation-review">

            <div className="result-container col-12 padding-right-20-important">
              <div className="wrapper p-3">

                <form>
                  <h6>
                    {capitalizeFirstWord(translate('Decision'))}
                  </h6>
                  <div className="row">
                    <div className='col-6 col-md-4 '>
                      <div className='review-segment-component '>
                        <RadioButtons
                          className='vertical-radio-buttons'
                          value={deviationForm?.status}
                          name='status'
                          disabled={
                            !hasRole([Roles.ADMIN])
                          }
                          onChange={(e=>{handleStatusChange(e);})}
                          options={[
                            { label: capitalizeFirstWord(translate('APPROVED')), value: 'APPROVED' },
                            { label: capitalizeFirstWord(translate('audit')), value: 'REAUDIT' },
                            { label: capitalizeFirstWord(translate('return_for_correction')),
                              value: 'RETURN_IN_FIXING' },
                          ]}

                        />

                      </div>
                    </div>
                    <div className="col-md-8 deviation-review-comment">
                      <Textarea
                        ref={TextareaInput}
                        placeholder={translate('comment_on_correction')}
                        value={deviationForm?.comment || ''}
                        id={'id'}
                        name={'comment'}
                        classes={'form-control descriptionTextArea '}
                        onChange={handleTextAreaChange}
                        disabled={
                          !hasRole([Roles.ADMIN])
                        }
                      />
                    </div>
                  </div>
                </form>
              </div>
              {['APPROVED', 'REAUDIT', 'RETURN_IN_FIXING'].includes(deviationForm?.status) ? <Button
                disabled={
                  !hasRole([Roles.ADMIN]) ||
                  !deviationForm?.comment?.length ||
                  !['APPROVED', 'REAUDIT', 'RETURN_IN_FIXING'].includes(deviationForm?.status)
                }
                classes={
                  `${deviationForm?.status === 'APPROVED' ? 'deviation-approve-button ' : ''} 
                  padding-10 border-0 deviation-fix-button confirm-set-answer-button col-12 col-sm-auto
                  margin-top-20 margin-bottom-20`
                }
                icons={'far fa-check'}
                onClick={handleSendReport}
                iconsBoolean
                value={translate(
                  (deviationForm?.status === 'APPROVED' && 'send_and_mark_as_approved') ||
                  (deviationForm?.status === 'REAUDIT' && 'send_and_mark_as_audit') ||
                  (deviationForm?.status === 'RETURN_IN_FIXING' && 'return_to_supplier')
                )}
              /> : null }
            </div>
          </div>
        </div>
      </div>
    </div>


  );
}

const mapStateToProps = (state) => ({
  hasRole: authorizationService.hasRole,
  deviation: state.deviation.deviation,
  REACT_loading: state.deviation.REACT_loading,
  REACT_error: state.deviation.error,
  image: state.deviation.image,
  imageData: state.deviation.imageData,
  confirmSet: state.confirmSets.confirmSet,
});

const mapDispatchToProps = (dispatch) => {
  return {
    getDeviation: () => dispatch(getDeviation()),
    uploadDeviationImage: (data) => dispatch(uploadDeviationImage(data)),
    submitReview: (id, data) => dispatch(submitReview(id, data)),
    getDeviationImage: (id) => dispatch(getDeviationImage(id)),
  };
};

export const DeviationReview = connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(deviationReview));
