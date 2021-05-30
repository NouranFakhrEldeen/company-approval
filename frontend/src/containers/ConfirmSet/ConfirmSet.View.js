/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import './ConfirmSet.scss';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { AuthenticationServiceFactory } from '../../services';
import {
  AnswerConfirmSet,
  ReviewConfirmSet,
} from '../';
import { getConfirmSet, getConfirmSetCertificates } from '../../redux/ConfirmSet';
import * as Roles from '../../shared/role.constant';
const authorizationService = AuthenticationServiceFactory.getInstance();

function confirmSetView({
  hasRole,
  getConfirmSet,
  match,
  confirmSet,
  getConfirmSetCertificates,
}) {
  const id = match.params.id;
  const viewOnly = match.params.viewOnly;
  useEffect(()=>{
    id && getConfirmSet(id);
    id && getConfirmSetCertificates(id);
  }, [id]);
  return (
    <div className='confirm-set-view-container'>
      {(hasRole([Roles.ADMIN]) &&
    confirmSet?.status === 'COMPANY_FILLING') || hasRole([Roles.SERVICE_PROVIDER]) ?
        <AnswerConfirmSet id={id} companyID={confirmSet?.companyId}/> : null }
      { hasRole([Roles.ADMIN]) && confirmSet?.status !== 'COMPANY_FILLING' ?
        <ReviewConfirmSet id={id} viewOnly={viewOnly === 'view'} companyID={confirmSet?.companyId}/> : null }
    </div>
  );
}


const mapStateToProps = (state) => ({
  confirmSet: state.confirmSets.confirmSet,
  hasRole: authorizationService.hasRole,
  getUserRole: authorizationService.getUserRole,
});

const mapDispatchToProps = (dispatch) => {
  return {
    getConfirmSet: (id) => dispatch(getConfirmSet(id)),
    getConfirmSetCertificates: (id) => dispatch(getConfirmSetCertificates(id)),
  };
};
export const ConfirmSetView = connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(confirmSetView));

