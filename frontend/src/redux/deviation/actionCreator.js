import * as actions from './constants';
import { DeviationServiceFactory, ImageServiceFactory } from '../../services';
let DeviationService = DeviationServiceFactory.getInstance();
let ImageService = ImageServiceFactory.getInstance();
export function getDeviations(confirmSetId, query) {
  return async (dispatch) => {
    try {
      dispatch({
        type: actions.GET_DEVIATIONS,
      });
      const deviationtList = await DeviationService.filter(query, {
        confirmSetId,
      });
      const records = deviationtList.data.records;
      dispatch({
        type: actions.GET_DEVIATIONS_SUCCESS,
        payload: records,
      });
    } catch (error) {
      dispatch({
        type: actions.GET_DEVIATIONS_FAILURE,
        payload: error,
      });
    }
  };
}

export function getDeviation(confirmSetId, deviationId) {
  return async (dispatch) => {
    try {
      dispatch({
        type: actions.GET_DEVIATION,
      });
      const deviation = await DeviationService.getById(deviationId, {
        confirmSetId,
      });
      const records = deviation.data;
      dispatch({
        type: actions.GET_DEVIATION_SUCCESS,
        payload: records,
      });
    } catch (error) {
      dispatch({
        type: actions.GET_DEVIATION_FAILURE,
        payload: error,
      });
    }
  };
}

export function uploadDeviationImage(formData){

  return async (dispatch) => {
    try {
      dispatch({
        type: actions.CREATE_DEVIATION_IMAGE,
      });
      const response = await ImageService.create(formData);

      dispatch({
        type: actions.CREATE_DEVIATION_IMAGE_SUCCESS,
        payload: response.data,
      });
    } catch (error) {
      dispatch({
        type: actions.CREATE_DEVIATION_IMAGE_FAILURE,
        payload: error,
      });
    }
  };
}

export function submitFix(deviationId, deviation) {
  const newDeviation = {
    images: deviation.images || undefined,
    howItWasFixed: deviation.howItWasFixed || undefined,

  };
  const confirmSetId = deviation.confirmSetId;

  return async (dispatch) => {
    try {
      dispatch({
        type: actions.UPDATE_DEVIATION,
      });
      const res = await DeviationService.update(
        newDeviation,
        `${deviationId}/fix`,
        {
          confirmSetId,
        }

      );

      dispatch({
        type: actions.UPDATE_DEVIATION_SUCCESS,
        payload: res.data,
      });
    } catch (error) {
      dispatch({
        type: actions.UPDATE_DEVIATION_FAILURE,
        payload: error,
      });
    }
  };
}

export function submitReview(deviationId, deviation) {
  const newDeviation = {
    comment: deviation.comment || undefined,
    status: deviation.status || undefined,

  };
  const confirmSetId = deviation.confirmSetId;

  return async (dispatch) => {
    try {
      dispatch({
        type: actions.UPDATE_DEVIATION,
      });
      const res = await DeviationService.update(
        newDeviation,
        `${deviationId}/review`,
        {
          confirmSetId,
        }

      );

      dispatch({
        type: actions.UPDATE_DEVIATION_SUCCESS,
        payload: res.data,
      });
    } catch (error) {
      dispatch({
        type: actions.UPDATE_DEVIATION_FAILURE,
        payload: error,
      });
    }
  };
}


export function getDeviationImage(imageId){
  return async (dispatch) => {
    try {
      dispatch({
        type: actions.GET_IMAGE,
      });
      const image = await ImageService.getById(imageId);
      const records = image.data;

      dispatch({
        type: actions.GET_IMAGE_SUCCESS,
        payload: records,
      });
    } catch (error) {
      dispatch({
        type: actions.GET_IMAGE_FAILURE,
        payload: error,
      });
    }
  };
}