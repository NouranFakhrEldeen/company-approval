import { errorHandlerConst } from './constants';

const initialState = {

  [errorHandlerConst.DISPLAY_ERROR_MESSAGE_BOOLEAN]: null,
  [errorHandlerConst.DISPLAY_ERROR_MESSAGE]: '',
  [errorHandlerConst.ERROR_CODE]: 0,
  [errorHandlerConst.ERROR_RESPONSE]: {},
};

export const errorHanlder = (state = initialState, action) => {
  const oldState = { ...state };
  switch (action.type) {

  case errorHandlerConst.DISPLAY_ERROR_MESSAGE_BOOLEAN:
    return {
      ...oldState,
      [errorHandlerConst.DISPLAY_ERROR_MESSAGE_BOOLEAN]: action.DISPLAY_ERROR_MESSAGE_BOOLEAN,
    };

  case errorHandlerConst.DISPLAY_ERROR_MESSAGE:
    return {
      ...oldState,
      [errorHandlerConst.DISPLAY_ERROR_MESSAGE]: action.DISPLAY_ERROR_MESSAGE,
    };

  case errorHandlerConst.ERROR_CODE:
    return {
      ...oldState,
      [errorHandlerConst.ERROR_CODE]: action.ERROR_CODE,
    };

  case errorHandlerConst.ERROR_RESPONSE:
    return {
      ...oldState,
      [errorHandlerConst.ERROR_RESPONSE]: action.ERROR_RESPONSE,
    };


  default:
    return oldState;

  }
};