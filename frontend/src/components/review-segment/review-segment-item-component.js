import React, { useRef } from 'react';
import './review-segment.scss';
import { capitalizeFirstWord } from '../../helpers';
import { withTranslation } from 'react-i18next';
import { RadioButtons, DelayedInput } from '..';

function reviewSegmentItem({
  segmentItem,
  t: translate,
  className,
  disabled,
  onChange,
}) {
  let commentInput = useRef(null);

  return (
    <div className={`review-segment-item-component d-flex flex-wrap ${className || ''}`}>
      <div className='details-container col-md-5 col-12 d-inline-block'>
        <span className='number'>{segmentItem.number}</span>
        &nbsp;
        <span className='name'>{segmentItem.name}</span>
      </div>
      <form className='inputs-container col-md-7 col-12 flex-wrap d-flex'>
        <div className={`radio-buttons col-12 col-sm-12 padding-0 ${disabled && 'radio-disabled-border'}`}>
          <RadioButtons
            className='col-12 padding-0'
            name={'review'}
            value={segmentItem.answer}
            disabled
            options={[
              { label: capitalizeFirstWord(translate('yes')), value: 'YES' },
              { label: capitalizeFirstWord(translate('no')), value: 'NO' },
            ]}
          />
        </div>
        <div className='p-0 col-12 col-sm-12 ml-0 p-relative'>
          {segmentItem?.description && <div className='description-conatainer margin-bottom-20 margin-top-10'>
            {segmentItem.description}
          </div>}
          {segmentItem.answer === 'NO' ?
            <div className='position-relative'>
              <span className='top-label'>
                <div className='bg-color-white'/>
                {capitalizeFirstWord(translate('comment'))}
              </span>
              <DelayedInput
                disabled={disabled}
                delay={1000}
                ref={commentInput}
                value={segmentItem.comment}
                onChange={(e)=>{onChange(e, segmentItem);}}
                className='text-input w-100'
                type='text'
                name={'comment'}
              />
            </div> : null}
        </div>
      </form>
    </div>
  );
}

export const ReviewSegmentItem = withTranslation()(reviewSegmentItem);