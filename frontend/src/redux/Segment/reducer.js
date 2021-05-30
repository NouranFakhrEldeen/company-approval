import * as actions from './constants';
const initialState = {
  REACT_loading: false,
  segments: [],
  selectedSegment: {},
  error: null,
};
export const segmentReducer = (state = initialState, action) => {
  switch (action.type) {
  case actions.GET_SEGMENT: {

    return {
      ...state,
      REACT_loading: true,
      segments: null,
      error: false,
    };
  }
  case actions.GET_SEGMENT_SUCCESS: {
    return {
      ...state,
      REACT_loading: false,
      error: false,
      segments: action.payload,
    };
  }
  case actions.GET_SEGMENT_FAILURE: {
    return {
      ...state,
      REACT_loading: false,
      error: action.payload,
    };
  }


  case actions.SELECT_SEGMENT: {
    return {
      ...state,
      REACT_loading: true,
      selectedSegment: null,
      error: false,
    };
  }
  case actions.SELECT_SEGMENT_SUCCESS: {
    return {
      ...state,
      selectedSegment: action.payload,
    };
  }


  case actions.SELECT_SEGMENT_FAILURE: {
    return {
      ...state,
      selectedSegment: action.payload,
    };
  }
  default:
    return state;
  }
};
