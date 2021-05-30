import React, { useEffect } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { AuthenticationServiceFactory } from '../../services';
import { getDeviation } from '../../redux/deviation';
import { getConfirmSet } from '../../redux/ConfirmSet';
import * as Roles from '../../shared/role.constant';
import { DeviationFix, DeviationReview } from '../';
const authorizationService = AuthenticationServiceFactory.getInstance();

const deviationView = ({
  hasRole,
  match,
  getDeviation,
  getConfirmSet,
  confirmSet,
}) => {

  const { confirmSetId, id } = match.params;
  useEffect(()=>{
    id && getDeviation(confirmSetId, id, {});
    confirmSetId && getConfirmSet(confirmSetId);
  }, [id]);

  return (
    <div >
      {(hasRole([Roles.ADMIN]) && confirmSet.status === 'IN_DEVIATION_FIXING')
        || hasRole([Roles.SERVICE_PROVIDER]) ?
        <DeviationFix /> : null }
      {hasRole([Roles.ADMIN]) && confirmSet.status === 'IN_DEVIATION_PROCESSING' ?
        <DeviationReview/> : null }
    </div>
  );
};

const mapStateToProps = (state) => ({
  hasRole: authorizationService.hasRole,
  getUserRole: authorizationService.getUserRole,
  deviation: state.deviation.deviation,
  confirmSet: state.confirmSets.confirmSet,
});

const mapDispatchToProps = (dispatch) => {
  return {
    getConfirmSet: (id) => dispatch(getConfirmSet(id)),
    getDeviation: (confirmSetId, deviationId)=>dispatch(getDeviation(confirmSetId, deviationId)),
  };
};
export const DeviationView = connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(deviationView));
