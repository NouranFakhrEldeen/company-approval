import * as actions from './constants';
const initialState = {
  REACT_loading: false,
  segments: [],
  RADIOBTN_KEY: {},
  error: null,
  RADIOBTN_FIRE: '',
};
export const reusableCompReducer = (state = initialState, action) => {
  switch (action.type) {
  case actions.RADIOBTN_KEY: {

    return {
      ...state,
      REACT_loading: false,
      error: false,
      RADIOBTN_KEY: action.payload,
    };
  }

  default:
    return state;
  }
};
