import * as actions from './constants';
import {
  ConfirmSetServiceFactory,
  ConfrimSegmentItemServiceFactory,
  ConfrimSegmentServiceFactory,
  CertificateServiceFactory,
  ConfrimContactServiceFactory,
} from '../../services';
import rootReducer from '../rootReducer';

let ConfirmSetService = ConfirmSetServiceFactory.getInstance();
let ConfrimSegmentService = ConfrimSegmentServiceFactory.getInstance();
let ConfrimSegmentItemService = ConfrimSegmentItemServiceFactory.getInstance();
let CertificateService = CertificateServiceFactory.getInstance();
let contactService = ConfrimContactServiceFactory.getInstance();

export function createConfirmSet(confirmSet) {
  return async (dispatch) => {
    try {
      dispatch({
        type: actions.CREATE_CONFIRMSET,
      });
      const response = await ConfirmSetService.create(confirmSet);
      dispatch({
        type: actions.CREATE_CONFIRMSET_SUCCESS,
        payload: response,
      });
    } catch (error) {
      dispatch({
        type: actions.CREATE_CONFIRMSET_FAILURE,
        payload: error,
      });
    }
  };
}

export function createConfirmSetCertificate(formData) {
  return async (dispatch) => {
    try {
      dispatch({
        type: actions.CREATE_CONFIRMSET_CERTIFICATE,
      });
      const response = await CertificateService.create(formData);
      dispatch({
        type: actions.CREATE_CONFIRMSET_CERTIFICATE_SUCCESS,
        payload: response.data,
      });
    } catch (error) {
      dispatch({
        type: actions.CREATE_CONFIRMSET_CERTIFICATE_FAILURE,
        payload: error,
      });
    }
  };
}

export function createConfirmSetSegment(confirmsetId, segment) {
  segment['confirmsetId'] = confirmsetId;
  return async (dispatch) => {
    try {
      dispatch({
        type: actions.CREATE_CONFIRMSET_SEGMENT,
        payload: segment,
      });
      ConfrimSegmentService.create(segment);

      dispatch({
        type: actions.CREATE_CONFIRMSET_SEGMENT_SUCCESS,
        payload: segment,
      });
    } catch (error) {
      dispatch({
        type: actions.CREATE_CONFIRMSET_SEGMENT_FAILURE,
        payload: error,
      });
    }
  };
}

export function addConfirmSetContact(confirmSetId, contact) {
  contact['type'] = 'CONTACT';
  return async (dispatch) => {
    try {
      dispatch({
        type: actions.CREATE_CONFIRMSET_CONTACT,
        payload: contact,
      });
      contactService.create(contact, { confirmSetId });

      dispatch({
        type: actions.CREATE_CONFIRMSET_CONTACT_SUCCESS,
        payload: contact,
      });
    } catch (error) {
      dispatch({
        type: actions.CREATE_CONFIRMSET_CONTACT_FAILURE,
        payload: error,
      });
    }
  };
}

export function removeConfirmSetContact(confirmSetId, contactId) {

  return async (dispatch) => {
    try {
      dispatch({
        type: actions.DELETE_CONFIRMSET_CONTACT,

      });
      contactService.removeById(contactId, { confirmSetId });

      dispatch({
        type: actions.DELETE_CONFIRMSET_CONTACT_SUCCESS,
        payload: {
          confirmSetId,
          contactId,
        },
      });
    } catch (error) {
      dispatch({
        type: actions.DELETE_CONFIRMSET_CONTACT_FAILURE,
        payload: error,
      });
    }
  };
}


export function getConfirmSet(confirmsetId) {
  return async (dispatch) => {
    try {
      dispatch({
        type: actions.GET_CONFIRMSET,
      });
      let confirmSet = rootReducer.confrimSets?.confirmSets.find(
        (confirmSet) => confirmSet.id === confirmsetId
      );
      if (!confirmSet) {
        const res = await ConfirmSetService.getById(confirmsetId);
        confirmSet = res.data;
      }
      dispatch({
        type: actions.GET_CONFIRMSET_SUCCESS,
        payload: confirmSet,
      });
    } catch (error) {
      dispatch({
        type: actions.GET_CONFIRMSET_FAILURE,
        payload: error,
      });
    }
  };
}
export function submitConfirmSetsDeviationsAnswers(confirmsetId){
  return async (dispatch) => {
    try {
      dispatch({
        type: actions.UPDATE_CONFIRMSET,
      });
      const res = await ConfirmSetService.update({}, `${confirmsetId}/submit-deviation-answer`);
      const confirmSet = res.data;
      dispatch({
        type: actions.UPDATE_CONFIRMSET_SUCCESS,
        payload: confirmSet,
      });
    } catch (error) {
      dispatch({
        type: actions.UPDATE_CONFIRMSET_FAILURE,
        payload: error,
      });
    }
  };
}

export function submitConfirmSetsDeviationsReviews(confirmsetId){
  return async (dispatch) => {
    try {
      dispatch({
        type: actions.UPDATE_CONFIRMSET,
      });
      const res = await ConfirmSetService.update({}, `${confirmsetId}/devaition-status`);
      const confirmSet = res.data;
      dispatch({
        type: actions.UPDATE_CONFIRMSET_SUCCESS,
        payload: confirmSet,
      });
    } catch (error) {
      dispatch({
        type: actions.UPDATE_CONFIRMSET_FAILURE,
        payload: error,
      });
    }
  };
}

export function getConfirmSetCertificates(confirmsetId) {
  return async (dispatch) => {
    try {
      dispatch({
        type: actions.GET_CONFIRMSET_CERTIFICATES,
      });
      const res = await ConfirmSetService.getById(`${confirmsetId}/certificates`);
      const certificates = res.data;
      dispatch({
        type: actions.GET_CONFIRMSET_CERTIFICATES_SUCCESS,
        payload: certificates,
      });
    } catch (error) {
      dispatch({
        type: actions.GET_CONFIRMSET_CERTIFICATES_FAILURE,
        payload: error,
      });
    }
  };
}

export function getConfirmSetsById(companyId) {
  return async (dispatch) => {
    try {
      dispatch({
        type: actions.GET_CONFIRMSETS_BY_ID,
      });
      const res = await ConfirmSetService.filter({ companyId });
      const confirmSets = (res.data.records);

      dispatch({
        type: actions.GET_CONFIRMSETS_BY_ID_SUCCESS,
        payload: confirmSets,
      });
    } catch (error) {
      dispatch({
        type: actions.GET_CONFIRMSETS_BY_ID_FAILURE,
        payload: error,
      });
    }
  };
}

export function submitAnswerConfirmSet(confirmSetId) {
  return async (dispatch) => {
    try {
      let confirmSetData;
      dispatch({
        type: actions.UPDATE_CONFIRMSET,
      });
      const res = await ConfirmSetService.update(
        {},
        `${confirmSetId}/submit-answer`
      );
      if (res.data) {
        confirmSetData = res.data;
      }
      dispatch({
        type: actions.UPDATE_CONFIRMSET_SUCCESS,
        payload: confirmSetData,
      });
    } catch (error) {
      dispatch({
        type: actions.UPDATE_CONFIRMSET_FAILURE,
        payload: error,
      });
    }
  };
}

export function updateConfirmSegment(confirmSetId, segmentId, segment) {
  return async (dispatch) => {
    segment = {
      name: segment.name || undefined,
      status: segment.status || undefined,
      type: segment.type || undefined,
      city: segment.city || undefined,
      postalCode: segment.postalCode || undefined,
      street: segment.street || undefined,
      addressAlias: segment.addressAlias || undefined,
      room: segment.room || undefined,
      feedback: segment.feedback || undefined,
    };
    try {
      dispatch({
        type: actions.UPDATE_CONFIRMSET_SEGMENT,
        payload: segment,
      });
      const res = await ConfrimSegmentService.update(segment, `${segmentId}`, {
        confirmSetId,
      });
      if (res.data) {
        segment = res.data;
      }
      dispatch({
        type: actions.UPDATE_CONFIRMSET_SEGMENT_SUCCESS,
        payload: segment,
      });
    } catch (error) {
      dispatch({
        type: actions.UPDATE_CONFIRMSET_SEGMENT_FAILURE,
        payload: error,
      });
    }
  };
}

export function answerSegmentItem(confirmSetId, segmentId, itemId, item) {
  return async (dispatch) => {
    item = {
      answer: item.answer,
      description: item.description || undefined,
    };
    try {
      dispatch({
        type: actions.UPDATE_CONFIRMSET_SEGMENT_ITEM,
        payload: item,
      });
      const res = await ConfrimSegmentItemService.update(
        item,
        `${itemId}/answer`,
        {
          confirmSetId,
          segmentId,
        }
      );
      if (res.data) {
        item = res.data;
      }
      dispatch({
        type: actions.UPDATE_CONFIRMSET_SEGMENT_ITEM_SUCCESS,
        payload: item,
      });
    } catch (error) {
      dispatch({
        type: actions.UPDATE_CONFIRMSET_SEGMENT_ITEM_FAILURE,
        payload: error,
      });
    }
  };
}


export function submitReviewConfirmSet(confirmSetId, status) {
  return async (dispatch) => {
    try {
      let confirmSetData;
      dispatch({
        type: actions.UPDATE_CONFIRMSET,
      });
      const res = await ConfirmSetService.update({ status }, `${confirmSetId}/submit-review/`);
      if (res.data) {
        confirmSetData = res.data;
      }
      dispatch({
        type: actions.UPDATE_CONFIRMSET_SUCCESS,
        payload: confirmSetData,
      });
    } catch (error) {
      dispatch({
        type: actions.UPDATE_CONFIRMSET_FAILURE,
        payload: error,
      });
    }
  };
}

export function reviewSegmentItem(confirmSetId, segmentId, itemId, item) {
  return async (dispatch) => {
    item = {
      comment: item.comment || '',
    };
    try {
      dispatch({
        type: actions.UPDATE_CONFIRMSET_SEGMENT_ITEM,
        payload: item,
      });
      const res = await ConfrimSegmentItemService.update(item, `${itemId}/review`, {
        confirmSetId, segmentId,
      });
      if (res.data) {
        item = res.data;
      }
      dispatch({
        type: actions.UPDATE_CONFIRMSET_SEGMENT_ITEM_SUCCESS,
        payload: item,
      });
    } catch (error) {
      dispatch({
        type: actions.UPDATE_CONFIRMSET_SEGMENT_ITEM_FAILURE,
        payload: error,
      });
    }
  };
}

export function updateConfirmSegmentMetadata(confirmSetId, segmentId, segment) {
  return async (dispatch) => {
    // ((segment.hasCertificate === 'true') ? true : false)
    segment = {
      type: segment.type || undefined,
      city: segment.city || undefined,
      postalCode: segment.postalCode || undefined,
      street: segment.street || undefined,
      addressAlias: segment.addressAlias || undefined,
      room: segment.room || undefined,
      hasCertificate: segment.hasCertificate,
    };
    try {
      dispatch({
        type: actions.UPDATE_CONFIRMSET_SEGMENT,
        payload: segment,
      });
      const res = await ConfrimSegmentService.update(segment, `${segmentId}/metadata`, {
        confirmSetId,
      });
      if (res.data) {
        segment = res.data;
      }
      dispatch({
        type: actions.UPDATE_CONFIRMSET_SEGMENT_SUCCESS,
        payload: segment,
      });
    } catch (error) {
      dispatch({
        type: actions.UPDATE_CONFIRMSET_SEGMENT_FAILURE,
        payload: error,
      });
    }
  };
}
export function updateConfirmSetCertificate(confirmSetId, certificates) {
  return async (dispatch) => {

    try {
      dispatch({
        type: actions.UPDATE_CONFIRMSET_CERTIFICATES,
        payload: certificates,
      });
      const res = await ConfirmSetService.update({ certificates }, `${confirmSetId}/certificates/`);
      if (res.data) {
        certificates = res.data;
      }
      dispatch({
        type: actions.UPDATE_CONFIRMSET_CERTIFICATES_SUCCESS,
        payload: certificates,
      });
    } catch (error) {
      dispatch({
        type: actions.UPDATE_CONFIRMSET_CERTIFICATES_FAILURE,
        payload: error,
      });
    }
  };
}


export function duplicateSegment(confirmSetId, segmentId) {
  return async (dispatch) => {
    try {
      let duplicatedSegment;
      dispatch({
        type: actions.CREATE_CONFIRMSET_SEGMENT,
        payload: {},
      });
      const res = await ConfrimSegmentService.update(
        {},
        `${segmentId}/duplicate`,
        {
          confirmSetId,
        }
      );
      if (res.data) {
        duplicatedSegment = res.data;
      }
      dispatch({
        type: actions.CREATE_CONFIRMSET_SEGMENT_SUCCESS,
        payload: duplicatedSegment,
      });
    } catch (error) {
      dispatch({
        type: actions.CREATE_CONFIRMSET_SEGMENT_FAILURE,
        payload: error,
      });
    }
  };
}

const defaultFilters = { size: 15 };

// eslint-disable-next-line no-unused-vars
export function confirmSetListing(
  filters,
  page,
  confirmSetFilteration,
  oldCompanies
) {
  return async (dispatch) => {
    try {
      dispatch({
        type: actions.CONFIRMSETS_LISTING,
      });
      const confirmSetListing = await ConfirmSetService.filter({
        ...defaultFilters,
        ...filters,
        page,
        status: confirmSetFilteration,
      });
      const records = oldCompanies
        ? oldCompanies.concat(confirmSetListing.data.records)
        : confirmSetListing.data.records;

      dispatch({
        type: actions.CONFIRMSETS_LISTING_SUCCESS,
        payload: {
          data: records,
          pagination: confirmSetListing?.data.pagination,
        },
      });
    } catch (error) {
      dispatch({
        type: actions.CONFIRMSETS_LISTING_FAILURE,
        payload: error,
      });
    }
  };
}

export function confirmSetDropDownValue(filters, page) {
  return async (dispatch) => {
    try {
      // dispatch({
      //   type: actions.CONFIRMSET_DROPDOWNVALUE,
      // });
      const confirmSetListing = await ConfirmSetService.filter({
        ...defaultFilters,
        ...filters,
        page,
      });

      dispatch({
        type: actions.CONFIRMSET_DROPDOWNVALUE,
        payload: {
          data: confirmSetListing?.data?.records,
          pagination: confirmSetListing?.data.pagination,
        },
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('errror CONFIRMSET_DROPDOWNVALUE');
    }
  };
}

export function emptyFilterConfirmSet() {
  return async (dispatch) => {
    try {
      dispatch({
        type: actions.CONFIRMSETS_FILTERED_LIST_SUCCESS,
        payload: { data: [], pagination: {} },
      });
    } catch (error) {
      dispatch({
        type: actions.CONFIRMSETS_LISTING_FAILURE,
        payload: error,
      });
    }
  };
}

export function filterConfirmSet(
  {
    companyId,
    page,
    size,
    fromDate,
    toDate,

    confirmSetFilteration,
    fromInDeviationTime,
    toInDeviationTime,
  }
  ,
  oldCompanies,

) {
  return async (dispatch) => {
    try {
      dispatch({
        type: actions.CONFIRMSETS_FILTERED_LIST,
      });
      const Companies = await ConfirmSetService.filter({
        ...defaultFilters,
        page,
        size,
        companyId,
        from: fromDate,
        to: toDate,
        status: confirmSetFilteration,
        fromInDeviationTime,
        toInDeviationTime,

      });

      const records = oldCompanies
        ? oldCompanies.concat(Companies.data.records)
        : Companies.data.records;

      dispatch({
        type: actions.CONFIRMSETS_FILTERED_LIST_SUCCESS,
        payload: { data: records, pagination: Companies.data.pagination },
      });
    } catch (error) {
      dispatch({
        type: actions.CONFIRMSETS_FILTERED_LIST_FAILURE,
        payload: error,
      });
    }
  };
}
