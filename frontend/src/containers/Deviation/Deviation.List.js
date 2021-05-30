import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { getDeviations } from '../../redux/deviation';
import './styles/deviation.style.scss';
import { Header, Button } from '../../components';
import { AuthenticationServiceFactory } from '../../services';
import {
  submitConfirmSetsDeviationsAnswers,
  submitConfirmSetsDeviationsReviews,
  getConfirmSet,
} from '../../redux/ConfirmSet';
const authorizationService = AuthenticationServiceFactory.getInstance();
import * as Roles from '../../shared/role.constant';

const deviationList = ({
  t: translate,
  deviations,
  getDeviations,
  getConfirmSet,
  submitConfirmSetsDeviationsAnswers,
  submitConfirmSetsDeviationsReviews,
  hasRole,
  confirmSet,
  match,
  REACT_loading,
}) => {
  const id = match.params.id;
  useEffect(() => {
    id && getDeviations(id, {});
    id && getConfirmSet(id, {});
    if (REACT_loading) {
      window.location.reload();
    }
  }, [id]);
  let history = useHistory();
  const cancelRedirect = () => {
    history.push('/deviations');
  };
  let confirmSetId = id;
  let buttonStatus = ((
    hasRole([Roles.SERVICE_PROVIDER, Roles.ADMIN]) &&
    confirmSet.status === 'IN_DEVIATION_FIXING' &&
    deviations?.find((deviation) =>
      deviation?.status === 'IN_FIXING' || deviation?.status === 'RETURN_IN_FIXING'
    )
  ) && 'fix_deviations_first') ||
    ((
      hasRole([Roles.SERVICE_PROVIDER, Roles.ADMIN]) &&
      confirmSet.status === 'IN_DEVIATION_FIXING' &&
      !deviations?.find((deviation) =>
        deviation?.status === 'IN_FIXING' || deviation?.status === 'RETURN_IN_FIXING'
      )
    ) && 'move_to_review') ||
    ((
      hasRole([Roles.SERVICE_PROVIDER]) &&
      confirmSet.status === 'IN_DEVIATION_PROCESSING'
    ) && 'in_review') ||
    ((
      hasRole([Roles.ADMIN]) &&
      confirmSet.status === 'IN_DEVIATION_PROCESSING' &&
      deviations?.find((deviation) => deviation?.status === 'WAITING_APPROVE')
    ) && 'handle_deviations_first') ||
    ((
      hasRole([Roles.ADMIN]) &&
      confirmSet.status === 'IN_DEVIATION_PROCESSING' &&
      deviations?.find((deviation) => deviation?.status === 'RETURN_IN_FIXING')
    ) && 'return_for_correction') ||
    ((
      hasRole([Roles.ADMIN]) &&
      confirmSet.status === 'IN_DEVIATION_PROCESSING' &&
      deviations?.find((deviation) => deviation?.status === 'REAUDIT')
    ) && 'return_to_audit') ||
    ((
      hasRole([Roles.ADMIN]) &&
      confirmSet.status === 'IN_DEVIATION_PROCESSING' &&
      !deviations?.find((deviation) => deviation?.status !== 'APPROVED')
    ) && 'approve');
  return (
    <div className="deviation-container">
      <Header
        title={translate('deviations')}
        cancel={translate('cancel')}
        cancelBoolean
        iconsBoolean={false}
        icons={''}
        classes={''}
        cancelLinkFunction={cancelRedirect}
      />
      <div className="companies-list margin-top-20 margin-bottom-20">
        <div className="row margin-0">
          <div className='align-center d-block col-12 padding-bottom-15'>
            {buttonStatus ?
              <Button
                value={translate(buttonStatus)}
                disabled={
                  buttonStatus === 'fix_deviations_first' ||
                  buttonStatus === 'in_review' ||
                  buttonStatus === 'handle_deviations_first'
                }
                classes={`${buttonStatus === 'approve' ? 'deviation-approve-button' : ''} 
                padding-5 border-0 deviation-button`}
                onClick={() => {
                  confirmSet.status === 'IN_DEVIATION_FIXING' ?
                    submitConfirmSetsDeviationsAnswers(confirmSetId) : submitConfirmSetsDeviationsReviews(confirmSetId);
                  history.push('/deviations');
                }}
              /> :
              null
            }
          </div>
          <div className="result-container col-12 padding-right-20-important">
            <div className="wrapper cursor-pointer">
              {deviations
                ? deviations.map((item, index) => (
                  <div
                    onClick={() => history.push(`/confirm-set/${confirmSetId}/deviations/deviation/${item.id}`)}
                    key={index}
                    className="list-group-item">
                    <div className="row">
                      <div className="col-lg-8 col-md-8 col-sm-12">
                        <p>
                          <span>{item?.number} </span>
                          {item?.item}
                        </p>
                        <span>{item?.howToFix}</span>
                      </div>
                      <div className="text-sm-ceneter text-md-right col-md-4 col-sm-12">
                        {item?.status === 'APPROVED' ? (
                          <span className="approve">
                            <i className="far fa-check" />{' '}
                            {translate('APPROVED')}
                          </span>
                        ) : item?.status === 'IN_FIXING' || item?.status === 'RETURN_IN_FIXING' ? (
                          <span className="reaudit">
                            <i className="fas fa-wrench" />{' '}
                            {translate('IN_FIXING')}
                          </span>
                        ) : item?.status === 'WAITING_APPROVE' ? (
                          <span className="reaudit">
                            <i className="far fa-clock" />{' '}
                            {translate('WAITING_APPROVE')}
                          </span>
                        ) : item?.status === 'REAUDIT' ? (
                          <span className="reaudit">
                            {' '}
                            <i className="fas fa-undo" />{' '}
                            {translate('REAUDIT')}
                          </span>
                        ) : (
                          ''
                        )}
                      </div>
                    </div>
                  </div>
                ))
                : ''}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
const mapStateToProps = (state) => ({
  hasRole: authorizationService.hasRole,
  deviations: state.deviation.deviations,
  confirmSet: state.confirmSets.confirmSet,
  REACT_loading: state?.deviation?.REACT_loading,
});

const mapDispatchToProps = (dispatch) => {
  return {
    getConfirmSet: (id) => dispatch(getConfirmSet(id)),
    getDeviations: (id) => dispatch(getDeviations(id)),
    submitConfirmSetsDeviationsAnswers: (...props) => dispatch(submitConfirmSetsDeviationsAnswers(...props)),
    submitConfirmSetsDeviationsReviews: (...props) => dispatch(submitConfirmSetsDeviationsReviews(...props)),
  };
};

export const DeviationList = connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(deviationList));
