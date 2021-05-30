// eslint-disable-next-line no-undef
import { combineReducers } from 'redux';
import { companiesReducer } from '../redux/Copmany';
import { segmentReducer } from '../redux/Segment';
import { confirmSetsReducer } from '../redux/ConfirmSet';
import { errorHanlder } from '../redux/ErrorHandler';
import { deviationReducer } from '../redux/deviation';
import { pingReducer } from './Ping';
import { reducer as toastrReducer } from 'react-redux-toastr';

let rootReducer = combineReducers({
  errorHanlder,
  ping: pingReducer,
  companies: companiesReducer,
  segments: segmentReducer,
  confirmSets: confirmSetsReducer,
  deviation: deviationReducer,
  toastr: toastrReducer,
});
export default rootReducer;