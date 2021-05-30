import React from 'react';
import './buttons.scss';

function button({
  value,
  iconsBoolean,
  icons,
  classes,
  onClick,
  disabled,
  type,
}) {
  return (
    <div className="btnContClass">
      <button
        data-testid='button'
        disabled={disabled}
        className={classes}
        type={type}
        onClick={() => onClick()}>
        {iconsBoolean && <span className='iconsCont'>{<i className={icons} />}
        </span>}
        <span className="btnText">{value}</span>
      </button>
    </div>
  );
}

export const Button = button;
