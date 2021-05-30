import * as actions from './constants';

export function postRadioKey(value) {
  return async (dispatch) => {
    try {
      dispatch({
        type: actions.RADIOBTN_KEY,
        payload: value,
      });
    } catch (error) {
      // console.log('error reusable', error);
    }
  };
}
