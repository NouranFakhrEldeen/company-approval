import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Row } from 'react-bootstrap';
import { withTranslation } from 'react-i18next';
import { Header } from '../../components';
import { connect } from 'react-redux';
import { AuthenticationServiceFactory } from '../../services';
import { ping } from '../../redux/Ping';
import './styles/style.scss';
import { filterConfirmSet } from '../../redux/ConfirmSet/actionCreator';

// import i18n from '../../i18n';
import * as Roles from '../../shared/role.constant';
const authorizationService = AuthenticationServiceFactory.getInstance();

const home = ({
  t: translate,
  hasRole,
  ping,
  confirmSets,
  filterConfirmSet,
}) => {
  let history = useHistory();

  useEffect(() => {
    ping();
  }, []);

  const handleClick = (title) => {

    switch (title) {
    case 'company':
      return history.push('/Companies');
    case 'audit':
      window.location.href = '/audit/';
      break;
    case 'confirmSetList':
      history.push('/ConfirmSetList');
      break;
    case 'Deviation':
      history.push('/deviations');
      break;
    default:
      return history.push('/');
    }
  };

  useEffect(() => {
    if (!hasRole([Roles.AUDITOR])) {
      filterConfirmSet({ size: 1 }, undefined);
    }

  }, []);

  return (
    <div className='home-page'>
      <Header
        title={translate('SecurityProcedure')}
        cancel={translate('cancel')}
        cancelBoolean={false}
        iconsBoolean={false}
        icons={''}
        classes={''}
        homePage />

      <div className="container h-100">
        <div className=" min-vh-100 text-center m-0  d-flex flex-column justify-content-center ">
          <Row className='pl-5 pr-5 pt-5 d-flex justify-content-around margin-bottom-50'>
            {hasRole([Roles.ADMIN]) ? <div className="m-2 col-md-5 col-xs-12 cursor-pointer homepage-box">
              <div className='d-inline-block' onClick={() => { handleClick('company'); }}>
                <i className="fal fa-building fa-6x " />
                <h4 className='expandable-font-size p-5'>   {translate('Companies')}</h4>
              </div>
            </div> : null}
            {hasRole([Roles.ADMIN, Roles.AUDITOR]) ?
              <div className="m-2 col-md-5 col-xs-12 cursor-pointer homepage-box">
                <div className='d-inline-block' onClick={() => { handleClick('audit'); }}>
                  <i className="fas fa-badge-sheriff fa-6x " />
                  <h4 className='expandable-font-size p-5'> {translate('Audits')} </h4>
                </div>
              </div> : null}
          </Row>

          <Row className="pl-5 pb-5 pr-5 d-flex justify-content-around margin-bottom-50" >
            {hasRole([Roles.ADMIN, Roles.SERVICE_PROVIDER]) ?
              <div className="m-2 col-md-5 col-xs-12 cursor-pointer homepage-box">
                <div className='d-inline-block count-parent' onClick={() => { handleClick('confirmSetList'); }}>
                  <i className="fal fa-tasks fa-6x " />
                  {(
                    (hasRole([Roles.ADMIN]) && confirmSets?.statusCount?.CONFIRMING) ||
                    (hasRole([Roles.SERVICE_PROVIDER]) && confirmSets?.statusCount?.COMPANY_FILLING)
                  ) &&
                  <div className="count" >{hasRole([Roles.ADMIN]) ?
                    confirmSets?.statusCount?.CONFIRMING || 0 :
                    confirmSets?.statusCount?.COMPANY_FILLING || 0}</div>
                  }
                  <h4 className='expandable-font-size p-5'> {translate('SecurityProcedure')}</h4>
                </div>
              </div> : null}
            {hasRole([Roles.ADMIN, Roles.SERVICE_PROVIDER]) ?
              <div className="m-2 col-md-5 col-xs-12 cursor-pointer homepage-box">
                <div className='d-inline-block count-parent' onClick={() => { handleClick('Deviation'); }}>
                  <i className="fal fa-flag fa-6x " />
                  { (
                    (hasRole([Roles.ADMIN]) && confirmSets?.statusCount?.IN_DEVIATION_PROCESSING) ||
                    (hasRole([Roles.SERVICE_PROVIDER]) && confirmSets?.statusCount?.IN_DEVIATION_FIXING)
                  ) &&
                  <div className="count" >
                    {hasRole([Roles.ADMIN]) ?
                      confirmSets?.statusCount?.IN_DEVIATION_PROCESSING || 0 :
                      confirmSets?.statusCount?.IN_DEVIATION_FIXING || 0}
                  </div>
                  }
                  <h4 className='expandable-font-size p-5'> {translate('DeviationsInAudits')}</h4>
                </div>
              </div> : null}
          </Row>
        </div>
      </div>
    </div>
  );
};

const addToProps = (state) => {
  return {
    logout: authorizationService.logout,
    hasRole: authorizationService.hasRole,
    getUserRole: authorizationService.getUserRole,
    confirmSets: state?.confirmSets?.confirmSets_filtered_list_pagination,

  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    ping: () => dispatch(ping()),
    filterConfirmSet: (...props)=> dispatch(filterConfirmSet(...props)),
  };
};
export const Home = connect(
  addToProps,
  mapDispatchToProps
)(withTranslation()(home));
