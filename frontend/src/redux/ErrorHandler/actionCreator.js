import { errorHandlerConst } from './constants';

const displayErrorBoolean = (boolean) => {
  return {
    type: errorHandlerConst.DISPLAY_ERROR_MESSAGE_BOOLEAN,
    [errorHandlerConst.DISPLAY_ERROR_MESSAGE_BOOLEAN]: boolean,
  };
};

const displayErrorMessage = (message) => {
  return {
    type: errorHandlerConst.DISPLAY_ERROR_MESSAGE,
    [errorHandlerConst.DISPLAY_ERROR_MESSAGE]: message,
  };
};

const displayErrorCode = (errorCode) => {
  return {
    type: errorHandlerConst.ERROR_CODE,
    [errorHandlerConst.ERROR_CODE]: errorCode,
  };
};

const getFullErrorResponse = (response) => {
  return {
    type: errorHandlerConst.ERROR_RESPONSE,
    [errorHandlerConst.ERROR_RESPONSE]: response,
  };
};

export const errorHandlerActions = {
  displayErrorBoolean,
  displayErrorMessage,
  displayErrorCode,
  getFullErrorResponse,
};