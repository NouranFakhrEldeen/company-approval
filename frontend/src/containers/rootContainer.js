import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { errorHandlerActions } from '../redux/ErrorHandler';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import 'react-redux-toastr/lib/css/react-redux-toastr.min.css';
/**************Styles & fonts****************/
// import general styles
import '../styles/general-style.scss';
import '../styles/fonts/fontawesome.css';
import '../styles/fonts/light.css';
// import bootstrap
import 'bootstrap/scss/bootstrap.scss';
// eslint-disable-next-line no-unused-vars
// import Audit from './Audit/Audit';
// import ConfirmSetList from './ConfirmSet/ConfirmSet.List';
import {
  Home,
  CompaniesList,
  ConfirmSetView,
  ConfirmSetList,
  CompanyContainer,
  ComapnyView,
  ConfirmSetCreate,
  DeviationList,
  DeviationView,
  ConfirmSetListDeviation,
} from './';

import {
  ComponentsWrapper,
  ErrorHandlingModal,
} from '../components';

import ReduxToastr from 'react-redux-toastr';
const rootContainer = ({
  t: translate,
  errorHanlder,
}) => {

  let [title, setTitle] = useState('');

  useEffect(() => {
    setTitle(translate('company-approval'));
  }
  , []);

  document.title = translate(title);

  return (
    <div>
      <ReduxToastr
        timeOut={4000}
        newestOnTop={false}
        preventDuplicates
        position="top-right"
        getState={(state) => state.toastr} // This is the default
        transitionIn="fadeIn"
        transitionOut="fadeOut"
        progressBar
        closeOnToastrClick/>
      <Router>
        <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/CompanyCreate' component={CompanyContainer} />
          <Route exact path='/Company/:id/update' component={CompanyContainer} />
          <Route path='/company/:id/confirm-set/create' component={ConfirmSetCreate} />
          <Route path='/company/view/:id/confirm-set/create' component={ConfirmSetCreate} />
          <Route exact path='/Companies' component={CompaniesList} />
          <Route exact path='/confirm-set/:id' component={ConfirmSetView} />
          <Route exact path='/confirm-set/:id/report/:viewOnly' component={ConfirmSetView} />
          <Route exact path='/company/:id' component={ComapnyView} />
          <Route exact path='/wrapper' component={ComponentsWrapper} />
          <Route exact path='/ConfirmSetList' component={ConfirmSetList} />
          <Route exact path='/confirm-set/:confirmSetId/deviations/deviation/:id' component={DeviationView} />
          <Route exact path='/deviations' component={ConfirmSetListDeviation} />
          <Route exact path='/confirm-set/:id/deviations' component={DeviationList} />
        </Switch>
        {errorHanlder.DISPLAY_ERROR_MESSAGE_BOOLEAN && <ErrorHandlingModal />}
      </Router>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    errorHanlder: state.errorHanlder,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    ...errorHandlerActions,
  }, dispatch);
}

export const RootContainer = connect(mapStateToProps, mapDispatchToProps)(withTranslation()(rootContainer));