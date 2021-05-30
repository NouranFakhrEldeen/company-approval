import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import './error-handling.scss';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { bindActionCreators } from 'redux';
import { errorHandlerActions } from '../../redux/ErrorHandler';

import { AuthenticationServiceFactory } from '../../services/authentication.service';

const authenticationService = AuthenticationServiceFactory.getInstance();

function errorHandlingModal({
  t: translate,
  errorHandling,
  displayErrorBoolean,
  redirectionToLogin,
}) {
  const errorHandlingMessages = ()=> {
    switch (errorHandling.ERROR_CODE) {
    case 400:
      return <div>
        <h2>{translate('status_code_400_title')}</h2>
        <div>{translate('status_code_400')}</div>
        <p>{translate('status_code_400_reported')}</p>
      </div>;
    case 401:
      return <div>
        <h2>{translate('status_code_401_title')}</h2>
        <div>{translate('status_code_401')}</div>
        <p>{translate('status_code_401_reported')}</p>
      </div>;
    case 403:
      return <div>
        <h2>{translate('status_code_403_title')}</h2>
        <div>{translate('status_code_403')}</div>
        <p>{translate('status_code_403_reported')}</p>
      </div>;
    case 404:
      return <div>
        <h2>{translate('status_code_404_title')}</h2>
        <div>{translate('status_code_404')}</div>
        <p>{translate('status_code_404_reported')}</p>
      </div>;
    case 500:
      return <div>
        <h2>{translate('status_code_500_title')}</h2>
        <div>{translate('status_code_500')}</div>
        <p>{translate('status_code_500_reported')}</p>
      </div>;
    case 501:
      return <div>
        <h2>{translate('status_code_501_title')}</h2>
        <div>{translate('status_code_501')}</div>
        <p>{translate('status_code_501_reported')}</p>
      </div>;
    case 502:
      return <div>
        <h2>{translate('status_code_502_title')}</h2>
        <div>{translate('status_code_502')}</div>
        <p>{translate('status_code_502_reported')}</p>
      </div>;
    case 503:
      return <div>
        <h2>{translate('status_code_503_title')}</h2>
        <div>{translate('status_code_503')}</div>
        <p>{translate('status_code_503_reported')}</p>
      </div>;
    case 504:
      return <div>
        <h2>{translate('status_code_504_title')}</h2>
        <div>{translate('status_code_504')}</div>
        <p>{translate('status_code_504_reported')}</p>
      </div>;
    case 'without_status_code':
      return <div>
        <h2>{translate('Network_Error_title')}</h2>
        <p>{translate('Network_Error')}</p>
      </div>;
    default:
      return <div>
        <h2>{translate('status_request_other_errors_title')}</h2>
        <div>{translate('status_request_other_errors')}</div>
        <p>{translate('status_request_other_errors_reported')}</p>
      </div>;
    }
  };

  return (
    <Modal
      show={errorHandling.DISPLAY_ERROR_MESSAGE_BOOLEAN}
      animation={false}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className='error-handling-modal'
      data-testid='error-handling-modal'
    >
      <Modal.Body>
        <div className='error-modal-content'>
          <button type="button"
            className="close error-modal-close-icon"
            onClick={()=> {
              displayErrorBoolean(false);
              if (errorHandling.ERROR_CODE === 401){
                redirectionToLogin();
              }
            }}>
            <span aria-hidden="true">&times;</span>
            <span className="sr-only">Close</span>
          </button>

          <div className='error-modal-leftBg'>
            <span className='fas fa-exclamation-triangle' />
          </div>
          <div className='error-modal-rightCont'>
            <div>

              {
                errorHandlingMessages()
              }
            </div>
            <div className='error-modal-btnAlignment'>
              <Button
                variant="primary"
                onClick={()=>{
                  displayErrorBoolean(false);
                  if (errorHandling.ERROR_CODE === 401){
                    redirectionToLogin();
                  }
                }}
                data-testid='error-handling-modal-closeBtn'
              >
                {translate('ok')}
              </Button>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}


function mapStateToProps(state) {
  return {
    rounds: state.createInspectionRounds,
    errorHandling: state.errorHanlder,
    redirectionToLogin: authenticationService.redirectionToLogin,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    ...errorHandlerActions,
  }, dispatch);

}

export const ErrorHandlingModal = connect(mapStateToProps, mapDispatchToProps)(withTranslation()(errorHandlingModal));
