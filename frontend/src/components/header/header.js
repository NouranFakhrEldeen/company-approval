/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import { capitalizeFirstWord } from '../../helpers';
import './header.scss';
import i18n from '../../i18n';
import * as Roles from '../../shared/role.constant';
import { AuthenticationServiceFactory } from '../../services';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

const authorizationService = AuthenticationServiceFactory.getInstance();
function header({
  title,
  cancel,
  iconsBoolean,
  icons,
  classes,
  cancelBoolean,
  cancelLinkFunction,
  hasRole,
  logout,
  t: translate,
  homePage,
}) {

  useEffect(() => {
    if (i18n.language !== 'en') {
      i18n.changeLanguage('fi');
    }
  }, []);
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className={`audit-checklist-listing-header ${homePage ? 'homePage' : 'inners'}`}
      data-testid='header'
    >
      {/* cancel */}
      {cancelBoolean && <div
        className='float-left font-size-large decoration-none
         d-inline-block cursor-pointer-hover link-color margin-top-15 margin-left-10'
        onClick={(e)=> cancelLinkFunction(e)}>
        <span className='fas fa-chevron-left margin-right-5'/>
        <span className='header-title-back-lbl'>{capitalizeFirstWord(cancel)}</span>
      </div>}

      {/* title */}
      <h1 className=' d-inline-block  font-size-x-large printTitle '>
        <span>{capitalizeFirstWord(title)}</span>
      </h1>
      {
        homePage ?
          <div className='language-switcher'>
            {i18n.language === 'fi' &&
          <button className='select-en' onClick={() => changeLanguage('en')}>
            <span className='fal fa-globe' />

            <span className='d-inline-block margin-left-10'>English</span>
          </button>}

            {i18n.language === 'en' &&
          <button className='select-fi' onClick={() => changeLanguage('fi')}>
            <span className='fal fa-globe' />
            <span className='d-inline-block margin-left-10'>Suomi</span>
          </button>}

            { <button className='logout-btn'
              onClick={logout}
            >
              <span className='logout-icon fas fa-sign-out-alt margin-right-5' />
              {translate('logout')}
            </button>}

          </div>
          : null
      }

    </div>
  );
}

const addToProps = () => {
  return {
    logout: authorizationService.logout,
    hasRole: authorizationService.hasRole,
    getUserRole: authorizationService.getUserRole,
  };
};

export const Header = connect(
  addToProps
)(withTranslation()(header));

// export const Header = header;
