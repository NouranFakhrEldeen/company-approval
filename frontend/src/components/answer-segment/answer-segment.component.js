import React from 'react';
import { AnswerSegmentItem, SegmentMetaDataForm, RadioButtons } from '../';
import './answer-segment.scss';
// eslint-disable-next-line no-unused-vars
import * as _ from 'lodash';
import { withTranslation } from 'react-i18next';

function answerSegment({
  confirmSetSegment,
  onChange,
  disabled,
  t: translate,
  certificates,
}) {
  const handleItemChange = (e, item) => {
    const temp = { ...confirmSetSegment, items: confirmSetSegment?.items.map((mainItem)=>{
      if (item.id === mainItem.id)
        mainItem[e.target.name] = e.target.value;
      return mainItem;
    }) };
    item = temp.items.find((mainItem)=>(item.id === mainItem.id));
    item && onChange(temp, item);
  };
  const handleMetaDataChange = (e) =>{
    if (confirmSetSegment[e.target.name] !== e.target.value)
      onChange({ ...confirmSetSegment, [e.target.name]: e.target.value });
  };
  const handleCertficateChange = (e) =>{
    if (confirmSetSegment[e.target.name] !== e.target.value)
      onChange({ ...confirmSetSegment, [e.target.name]: (e.target.value === 'true') ? true : false });
  };
  return (
    <div className='answer-segment-component'>
      <div className='card'>
        <h3 className='header'>
          {confirmSetSegment.name}
        </h3>
        <div>
          { confirmSetSegment?.type !== 'NORMAL' ?
            <SegmentMetaDataForm
              disabled={disabled}
              type={confirmSetSegment.type}
              segment={confirmSetSegment}
              onChange={handleMetaDataChange}
            /> : null }
        </div>
        <div className="ml-3">
          <p className={`${certificates?.length ? 'd-block' : 'd-none'}`}>
            {translate('Existing_certificate_covers_this_section')}
          </p>
          {/* add radio button with hasCertificate value  */}
          <div className='radio-buttons col-12 col-sm-6 padding-0 d-flex'>
            <form className={`${certificates?.length ? 'd-block' : 'd-none'}`}>
              <RadioButtons
                disabled={disabled}
                className='col-12 padding-0'
                name={'hasCertificate'}
                value={confirmSetSegment.hasCertificate}
                options={[
                  { label: translate('yes'), value: true },
                  { label: translate('no'), value: false },
                ]}
                onChange={(e=>{handleCertficateChange(e);})}
                checked ={false}
              />
            </form>

          </div>
        </div>
        { confirmSetSegment?.hasCertificate == false ?
          <div>

            {confirmSetSegment.items.map((item, index)=>
              <div key={`${item.name}_${index}`}>
                <AnswerSegmentItem
                  disabled={disabled}
                  onChange={handleItemChange}
                  segmentItem={item} />
              </div>
            )}
          </div> : null
        }
      </div>
    </div>
  );
}

export const AnswerSegment = withTranslation()(answerSegment);
