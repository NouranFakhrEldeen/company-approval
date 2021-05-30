import * as actions from './constants';
// import { createConfirmSet } from '../ConfirmSet/actionCreator';
import { PingServiceFactory } from '../../services';
let pingService = PingServiceFactory.getInstance();


export function ping() {
  return async (dispatch) => {
    try {
      dispatch({
        type: actions.PING,
      });
      await pingService.filter();
      dispatch({
        type: actions.PING_SUCCESS,
      });
    } catch (error) {
      dispatch({
        type: actions.PING_FAILURE,
        payload: error,
      });
    }
  };
}
