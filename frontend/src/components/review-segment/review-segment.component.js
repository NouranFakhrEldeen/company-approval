import React, { useRef } from 'react';
import { ReviewSegmentItem } from '..';
import './review-segment.scss';
import { withTranslation } from 'react-i18next';
import { RadioButtons } from '../radioButtons/radioButtons';
import { capitalizeFirstWord } from '../../helpers';
import { Link } from 'react-router-dom';
import {
  CertificateServiceFactory,
} from '../../services';

import { DelayedInput } from '../delayed-input/delayed-input';

// TODO
const certificateService = CertificateServiceFactory.getInstance();

function reviewSegment({
  confirmSetSegment,
  onChange,
  disabled,
  t: translate,
  confirmSetCertificates,
}) {

  let feedbackInput = useRef(null);
  function debugBase64(base64URL){
    let win = window.open('');
    win.document.write(`<iframe src="${ base64URL }"
    frameborder="0" style="padding:0;margin:0;border:0; top:0px; left:0px; bottom:0px;
    right:0px; width:100%; height:100%;" allowfullscreen></iframe>`);
  }
  const openReport = async (certificateID)=>{
    const response = await certificateService.getById(`${certificateID}`);
    debugBase64(`data:${response?.data?.contentType};base64,${response?.data?.file}`);
  };

  const handleItemChange = (e, item) => {
    const temp = { ...confirmSetSegment, items: confirmSetSegment?.items.map((mainItem)=>{
      if (item.id === mainItem.id)
        mainItem[e.target.name] = e.target.value;
      return mainItem;
    }) };
    item = temp.items.find((mainItem)=>(item.id === mainItem.id));
    item && onChange(temp, item);
  };
  const handleStatusChange = (e) =>{
    if (confirmSetSegment[e.target.name] !== e.target.value)
      onChange({ ...confirmSetSegment, [e.target.name]: e.target.value });
  };
  const handleTextAreaChange = (event) => {
    const { name, value } = event.target;
    onChange({
      ...confirmSetSegment,
      [name]: value,
    });
  };
  return (
    <div className='review-segment-component'>
      <div className='card'>
        <h3 className='header'>
          {confirmSetSegment.name}
        </h3>
        <div className='with-separator'>
          { confirmSetSegment?.type !== 'NORMAL' ?
            <div className='padding-top-bottom-10'>
              {confirmSetSegment.addressAlias ?
                <div className='metadata-info'>
                  <p className='label'>{translate('address_alias').toUpperCase()}</p>
                  <p>{confirmSetSegment.addressAlias}</p>
                </div> : null}
              {confirmSetSegment.street ?
                <div className='metadata-info'>
                  <p className='label'>{translate('street_address').toUpperCase()}</p>
                  <p>{confirmSetSegment.street}</p>
                </div> : null}
              {/*
              {confirmSetSegment.room ?
                <div className='metadata-info'>
                  <p className='label'>{translate('room').toUpperCase()}</p>
                  <p>{confirmSetSegment.room}</p>
                </div> : null} */}
              {confirmSetSegment.postalCode ?
                <div className='metadata-info'>
                  <p className='label'>{translate('postal_code').toUpperCase()}</p>
                  <p>{confirmSetSegment.postalCode}</p>
                </div> : null}
              {confirmSetSegment.city ?
                <div className='metadata-info'>
                  <p className='label'>{translate('city').toUpperCase()}</p>
                  <p>{confirmSetSegment.city}</p>
                </div> : null}


            </div> : null }
        </div>
        {confirmSetSegment.hasCertificate ? <div>
          <div className='with-separator padding-top-bottom-10'>
            <div className='metadata-info'>
              <p> {translate('Existing_certificate_covers_this_section')}.
                {confirmSetCertificates?.length > 1
                  ?
                  <Link
                    onClick={()=> window.scrollTo({ top: 100, left: 100, behavior: 'smooth' })}
                  >
                    <span>{translate('Show_certificates')}</span>
                    <i className="fal fa-external-link" aria-hidden="true" />
                  </Link>
                  :
                  confirmSetCertificates?.map(certificateID => {
                    return (
                      <button key={Math.random()}
                        onClick={()=> openReport(certificateID)}
                        className='no-border report-button margin-left-10 button-noBg text_blue'>
                        <span>{capitalizeFirstWord(translate('Open_certificate'))}</span>
                        <span
                          className={`fal fa-external-link black-color
                          d-inline-block margin-left-5 text_blue`}/>
                      </button>
                    );
                  })
                }
              </p>

            </div>
          </div>
        </div> :
          <div>
            {confirmSetSegment.items.map((item, index)=>
              <div key={`${item.name}_${index}`}>
                <ReviewSegmentItem
                  disabled={disabled}
                  onChange={handleItemChange}
                  segmentItem={item} />
              </div>
            )}
          </div>
        }
        <div className='padding-10 with-separator'>
          <form>
            <div className="row">
              <div className='col-6 col-md-4 '>
                <h6>
                  {capitalizeFirstWord(translate('Decision'))}
                </h6>
                <RadioButtons
                  disabled={disabled}
                  className='vertical-radio-buttons'
                  value={confirmSetSegment.status}
                  name='status'
                  onChange={handleStatusChange}
                  options={[
                    { label: capitalizeFirstWord(translate('APPROVED')), value: 'APPROVED' },
                    { label: capitalizeFirstWord(translate('audit')), value: 'AUDIT' },
                    { label: capitalizeFirstWord(translate('return_to_service_provider')), value: 'RETURNED' },
                  ]} />
              </div>

              <div className="col-md-8 deviation-review-comment">
                { confirmSetSegment.status === 'RETURNED'
            &&
            <div className="col-md-8 deviation-review-comment margin-top-30">

              <div className='bg-color-white'>
                <span>
                  {capitalizeFirstWord(translate('feedback'))}
                </span>
                <DelayedInput
                  disabled={disabled}
                  delay={1000}
                  ref={feedbackInput}
                  value={confirmSetSegment.feedback}
                  onChange={handleTextAreaChange}
                  className='text-input w-100'
                  type='text'
                  name={'feedback'}
                />
              </div>

            </div>
                }
              </div>
            </div>

          </form>
        </div>
      </div>
    </div>);
}

export const ReviewSegment = withTranslation()(reviewSegment);
