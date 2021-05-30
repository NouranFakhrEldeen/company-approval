import React, { useRef } from 'react';
import './answer-segment.scss';
import { capitalizeFirstWord } from '../../helpers';
import { withTranslation } from 'react-i18next';
import { DelayedInput, RadioButtons } from '../';

function answerSegmentItem({
  segmentItem,
  // eslint-disable-next-line no-unused-vars
  onChange,
  t: translate,
  className,
  disabled,
}) {
  let descriptionInput = useRef(null);
  return (
    <div className={`answer-segment-item-component d-flex flex-wrap ${className || ''}`}>
      <div className='details-container col-md-5 col-12 d-inline-block'>
        <span className='number'>{segmentItem.number}</span>
        &nbsp;
        <span className='name'>{segmentItem.name}</span>
      </div>
      <form className='inputs-container col-md-7 col-12 flex-wrap d-flex'>
        <div className='radio-buttons col-12 col-sm-6 padding-0 d-flex'>
          <RadioButtons
            disabled={disabled}
            className='col-12 padding-0'
            name={'answer'}
            value={segmentItem.answer}
            options={[
              { label: capitalizeFirstWord(translate('yes')), value: 'YES' },
              { label: capitalizeFirstWord(translate('no')), value: 'NO' },
            ]}
            onChange={(e)=>{onChange(e, segmentItem);}}
          />
        </div>
        <div className='col-12 col-sm-6 ml-0 p-0 p-relative'>
          <DelayedInput
            disabled={disabled}
            delay={1000}
            placeholderOverlay={{
              message: segmentItem.answer === 'NO' ?
                capitalizeFirstWord(translate('required-answer-segment-description-placeholder'))
                :
                capitalizeFirstWord(translate('optional-answer-segment-description-placeholder')),
              required: segmentItem.answer === 'NO',
            }}
            ref={descriptionInput}
            value={segmentItem.description}
            onChange={(e)=>{onChange(e, segmentItem);}}
            className='text-input w-100 ml-sm-1'
            type='text'
            name={'description'}
          />
          {segmentItem.comment?.length ? <div className='comment-conatainer padding-5'>
            <span className='top-label d-block'>
              {capitalizeFirstWord(translate('comment'))}
            </span>
            {segmentItem.comment}
          </div> : null}
        </div>

      </form>
    </div>
  );
}

export const AnswerSegmentItem = withTranslation()(answerSegmentItem);