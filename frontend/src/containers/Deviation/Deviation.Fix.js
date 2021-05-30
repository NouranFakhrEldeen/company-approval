import React, { useEffect, useState, useCallback, useRef } from 'react';

import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import './styles/deviation.style.scss';
import { Header, DropZone, Button, Textarea, Feedback } from '../../components';
import * as _ from 'lodash';
import {
  getDeviation,
  uploadDeviationImage,
  submitFix,
  getDeviationImage,
} from '../../redux/deviation';
import { toastr } from 'react-redux-toastr';
function deviationFix({
  deviation,
  t: translate,
  submitFix,
  image,
  uploadDeviationImage,
  getDeviationImage,
  imageData,
  REACT_error,
}) {

  // let list = [{
  //   type: 'serive provider',
  //   email: 'test@email.com',
  //   createdAt: '20/5/2021',
  //   comment: 'ay 7aga ',
  // },
  // {
  //   type: 'security',
  //   email: 'test@email.com',
  //   createdAt: '20/5/2021',
  //   comment: 'ay 7aga ',
  // },
  // ];

  let history = useHistory();
  const [validFiles, setValidFiles] = useState([]);
  const [deviationForm, setDeviationForm] = useState({ images: [] });
  const onDrop = useCallback((acceptedFiles) => {
    setValidFiles([...acceptedFiles]);
  }, []);

  useEffect(() => {
    if (deviationForm?.images?.length) {

      for (let index = 0; index < deviationForm?.images?.length; index++) {
        getDeviationImage(deviationForm?.images[index]);
      }
    }
  }, [deviationForm?.images]);

  const handleSendReport = () => {
    deviation?.id && submitFix(deviation?.id, deviationForm);
    if (deviation && REACT_error)
    {
      toastr.success('success', 'statment has been sent successfully');
    }
    history.push(`/confirm-set/${deviation?.confirmSetId}/deviations`);
  };

  useEffect(() => {
    for (let i = 0; i < validFiles.length; i++) {
      const formData = new FormData();
      const confirmSetId = confirmSetId;
      const deviationId = deviation.id;
      formData.append('file', validFiles[i]);
      formData.append('confirmSetId', confirmSetId);
      formData.append('deviationId', deviationId);
      uploadDeviationImage(formData);
    }
  }, [validFiles]);
  useEffect(() => {
    if (!_.isEmpty(image)) {
      let data = [];
      data.push(image.id);
      setDeviationForm({
        ...deviationForm,
        images: data,
      });
    }
  }, [image]);
  const handleTextAreaChange = (event) => {
    const { name, value } = event.target;
    setDeviationForm({
      ...deviationForm,
      [name]: value,
    });
  };
  let TextareaInput = useRef(null);
  useEffect(() => {
    const temp = {
      id: deviation?.id,
      confirmSetId: deviation?.confirmSetId,
      status: deviation?.status,
      howItWasFixed: deviation?.feedbackHistory?.find(
        feedback => feedback.retryNo === deviation.retryNo
      )?.howItWasFixed || '',
      images: deviation?.images || [],
    };

    if (deviation) {
      setDeviationForm({ ...clean(temp) });
    }
  }, [deviation]);

  const clean = (obj) => {
    for (var propName in obj) {
      if (obj[propName] === null || obj[propName] === undefined) {
        delete obj[propName];
      }
    }
    return obj;
  };

  return (
    <div>
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
                        {deviation?.number}
                        {deviation?.item}
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
          <div className="row margin-0">
            <div className="result-container col-12 padding-right-20-important">
              <div className="wrapper">
                <div className="list-group-item">
                  <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12" >
                      <Feedback
                        title = {translate('previous_comments') }
                        historylist = {deviation?.feedbackHistory?.filter((feed)=> feed.retryNo !== deviation.retryNo)}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <Textarea
                        ref={TextareaInput}
                        placeholder={translate('comment_on_correction')}
                        value={deviationForm?.howItWasFixed || ''}
                        id={'id'}
                        name={'howItWasFixed'}
                        classes={'form-control descriptionTextArea '}
                        onChange={(e) => handleTextAreaChange(e)}
                        disabled={
                          deviationForm?.status == 'APPROVED' ||
                          deviationForm?.status == 'REAUDIT' ||
                          deviationForm?.status == 'WAITING_APPROVE'
                        }
                      />
                      <div className="sepatator" />
                      <span>{translate('Kuva korjauksesta')}</span>
                      <DropZone
                        onDrop={onDrop}
                        accept={' image/*'}
                        multiple={false}
                        disabled={
                          deviationForm?.status == 'APPROVED' ||
                          deviationForm?.status == 'REAUDIT' ||
                          deviationForm?.status == 'WAITING_APPROVE'
                        }
                      />
                      {validFiles
                        ? validFiles.map((item, index) => {
                          return <div key={index}>{item.name}</div>;
                        })
                        : ''}
                      <div>
                        {deviation?.images
                          ? deviation.images.map((item, index) => {
                            return (
                              <div key={index}>
                                <div className="certificate-name">
                                  <p className="certificate-title">
                                    {imageData?.name}
                                    <i className="fal fa-external-link" />
                                  </p>
                                </div>
                              </div>
                            );
                          })
                          : ''}
                      </div>
                    </div>

                  </div>
                </div>
              </div>
              <Button
                disabled={
                  deviation?.status == 'APPROVED' ||
                  deviation?.status == 'REAUDIT' ||
                  deviation?.status == 'WAITING_APPROVE' ||
                  !deviationForm?.howItWasFixed?.length ||
                  !deviationForm?.images
                }
                classes={
                  'padding-5 border-0 deviation-fix-button confirm-set-answer-button col-12 col-sm-auto margin-top-20'
                }
                icons={'far fa-check'}
                onClick={handleSendReport}
                iconsBoolean
                value={translate('send_and_mark_as_corrected')}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
const mapStateToProps = (state) => ({
  deviation: state.deviation.deviation,
  REACT_loading: state.deviation.REACT_loading,
  REACT_error: state.deviation.error,
  image: state.deviation.image,
  imageData: state.deviation.imageData,

});

const mapDispatchToProps = (dispatch) => {
  return {
    getDeviation: () => dispatch(getDeviation()),
    uploadDeviationImage: (data) => dispatch(uploadDeviationImage(data)),
    submitFix: (id, data) => dispatch(submitFix(id, data)),
    getDeviationImage: (id) => dispatch(getDeviationImage(id)),
  };
};

export const DeviationFix = connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(deviationFix));
