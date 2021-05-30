import { store } from '../../redux';
import * as actions from './constants';
import { SegmentServiceFactory } from '../../services/segments.service';
import * as _ from 'lodash';
// import { createConfirmSetSegment } from '../Copmany/actionCreator';
let SegmentService = SegmentServiceFactory.getInstance();

export function getSegments() {
  return async (dispatch) => {
    try {
      dispatch({
        type: actions.GET_SEGMENT,
      });
      const response = await SegmentService.filter();
      const Segments = response.data.records;
      dispatch({
        type: actions.GET_SEGMENT_SUCCESS,
        payload: Segments,
      });
    } catch (error) {
      dispatch({
        type: actions.GET_SEGMENT_FAILURE,
        payload: error,
      });
    }
  };
}
export function selectSegment(segmentId) {
  const state = store.getState();
  const temp = _.filter(
    state.segments.segments,
    (s) => s.id === segmentId
  )[0];
  const selectedSegment = {
    checklistId: temp.checklistId,
    segmentId: temp.id,
    name: temp.name,
    type: temp.type,
    items: temp.items.map((elemnt) => ({
      name: elemnt.name,
      number: elemnt.number,
    })),
  };
  return async (dispatch) => {
    try {
      dispatch({
        type: actions.SELECT_SEGMENT,
      });
      dispatch({
        type: actions.SELECT_SEGMENT_SUCCESS,
        payload: selectedSegment,
      });
    } catch (error) {
      dispatch({
        type: actions.GET_SEGMENT_FAILURE,
        payload: error,
      });
    }

  };
}
