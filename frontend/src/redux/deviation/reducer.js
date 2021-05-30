import * as actions from './constants';
const initialState = {
  REACT_loading: false,
  deviations: [],
  error: null,
  deviation: {},
  image: {},
  imageData: {},
};
export const deviationReducer = (state = initialState, action) => {
  switch (action.type) {
  case actions.GET_DEVIATIONS: {
    return {
      ...state,
      REACT_loading: true,
      deviations: null,
      error: false,
    };
  }
  case actions.GET_DEVIATIONS_SUCCESS: {
    return {
      ...state,
      REACT_loading: false,
      error: false,
      deviations: action.payload,

    };
  }
  case actions.GET_DEVIATIONS_FAILURE
  : {
    return {
      ...state,
      REACT_loading: false,
      error: action.payload,
    };
  }
  case actions.GET_DEVIATION: {
    return {
      ...state,
      REACT_loading: true,
      deviation: null,
      error: false,
    };
  }
  case actions.GET_DEVIATION_SUCCESS: {
    return {
      ...state,
      REACT_loading: false,
      error: false,
      deviation: action.payload,

    };
  }
  case actions.GET_DEVIATION_FAILURE
  : {
    return {
      ...state,
      REACT_loading: false,
      error: action.payload,
    };
  }
  case actions.CREATE_DEVIATION_IMAGE: {
    return {
      ...state,
      REACT_loading: true,
      image: {},
      error: false,
    };
  }
  case actions.CREATE_DEVIATION_IMAGE_SUCCESS: {
    return {
      ...state,
      REACT_loading: false,
      error: false,
      image: action.payload,
    };
  }
  case actions.CREATE_DEVIATION_IMAGE_FAILURE: {
    return {
      ...state,
      REACT_loading: false,
      error: action.payload,
    };
  }

  case actions.UPDATE_DEVIATION: {
    return {
      ...state,
      REACT_loading: true,
      error: false,
    };
  }
  case actions.UPDATE_DEVIATION_SUCCESS: {
    return {
      ...state,
      REACT_loading: false,
      error: false,
      deviation: action.payload,
    };
  }
  case actions.UPDATE_DEVIATION_FAILURE: {
    return {
      ...state,
      REACT_loading: false,
      error: action.payload,
    };
  }

  case actions.GET_IMAGE: {
    return {
      ...state,
      REACT_loading: true,
      imageData: {},
      error: false,
    };
  }
  case actions.GET_IMAGE_SUCCESS: {
    return {
      ...state,
      REACT_loading: false,
      error: false,
      imageData: action.payload,
    };
  }
  case actions.GET_IMAGE_FAILURE: {
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