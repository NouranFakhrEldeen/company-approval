import { store } from '../redux';
import { errorHandlerActions } from '../redux/ErrorHandler';


export const errors = (error)=> {
  if (error) {
    // save status code
    store.dispatch(errorHandlerActions.displayErrorCode(error.response?.status || 'without_status_code'));
    // save full response
    store.dispatch(errorHandlerActions.getFullErrorResponse(error));
    // open modal
    store.dispatch(errorHandlerActions.displayErrorBoolean(true));
    throw error;
  }
};
