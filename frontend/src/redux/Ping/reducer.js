import * as actions from './constants';


export const pingReducer = (state = {}, action) => {
  switch (action.type) {
  case actions.PING: {
    return {
      ...state,
      REACT_loading: true,
      error: false,
    };
  }
  case actions.PING_SUCCESS: {
    return {
      ...state,
      REACT_loading: false,
      error: false,
    };
  }
  case actions.PING_FAILURE: {
    return {
      ...state,
      REACT_loading: false,
      error: action.payload,
    };
  }

  default:
    return state;
  }
};
