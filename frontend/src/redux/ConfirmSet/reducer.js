import * as actions from './constants';
const initialState = {
  REACT_loading: false,
  error: null,
  confirmSet: {},
  contact: {},
  confirmSets: [],
  confirmSets_listing: [],
  confirmSets_dropdown_value: [],
  confirmSets_listing_pagination: {},
  confirmSets_filtered_list: [],
  confirmSets_filtered_list_pagination: {},
  certificate: {},
  certificates: [],

};

export const confirmSetsReducer = (state = initialState, action) => {
  switch (action.type) {

  case actions.CREATE_CONFIRMSET: {
    return {
      ...state,
      REACT_loading: true,
      confirmSet: {},
      error: false,
    };
  }
  case actions.CREATE_CONFIRMSET_SUCCESS: {
    return {
      ...state,
      REACT_loading: false,
      error: false,
      confirmSet: action.payload,
    };
  }
  case actions.CREATE_CONFIRMSET_FAILURE: {
    return {
      ...state,
      REACT_loading: false,
      error: action.payload,
    };
  }
  case actions.CREATE_CONFIRMSET_CERTIFICATE: {
    return {
      ...state,
      REACT_loading: true,
      certificate: {},
      error: false,
    };
  }
  case actions.CREATE_CONFIRMSET_CERTIFICATE_SUCCESS: {
    return {
      ...state,
      REACT_loading: false,
      error: false,
      certificate: action.payload,
    };
  }
  case actions.CREATE_CONFIRMSET_CERTIFICATE_FAILURE: {
    return {
      ...state,
      REACT_loading: false,
      error: action.payload,
    };
  }

  case actions.CREATE_CONFIRMSET_SEGMENT: {
    return {
      ...state,
      REACT_loading: true,
      error: false,
    };
  }
  case actions.CREATE_CONFIRMSET_SEGMENT_SUCCESS: {
    return {
      ...state,
      REACT_loading: false,
      error: false,
      confirmSet: { ...state.confirmSet, segments: state.confirmSet.segments.concat(action.payload) },
    };
  }
  case actions.CREATE_CONFIRMSET_SEGMENT_FAILURE: {
    return {
      ...state,
      REACT_loading: false,
      error: action.payload,
    };
  }


  case actions.CREATE_CONFIRMSET_CONTACT: {
    return {
      ...state,
      REACT_loading: true,
      contact: {},
      error: false,
    };
  }
  case actions.CREATE_CONFIRMSET_CONTACT_SUCCESS: {
    let contacts = JSON.parse(JSON.stringify([...state?.confirmSet.contacts, action.payload]));
    return {
      ...state,
      REACT_loading: false,
      error: false,
      contact: action.payload,
      confirmSet: { ...state?.confirmSet,
        contacts }
      ,
      confirmSets: state?.confirmSets.map((item)=>{
        if (item.id !== action.payload.confirmSetId)
          return item;
        else {
          return { ...item, contacts };
        }
      }),
    };
  }
  case actions.CREATE_CONFIRMSET_CONTACT_FAILURE: {
    return {
      ...state,
      REACT_loading: false,
      error: action.payload,
    };
  }
  case actions.GET_CONFIRMSET: {
    return {
      ...state,
      REACT_loading: true,
      confirmSet: {},
      error: false,
    };
  }
  case actions.GET_CONFIRMSET_SUCCESS: {
    return {
      ...state,
      REACT_loading: false,
      error: false,
      confirmSet: action.payload,
    };
  }
  case actions.GET_CONFIRMSET_FAILURE: {
    return {
      ...state,
      REACT_loading: false,
      error: action.payload,
    };
  }
  case actions.GET_CONFIRMSET_CERTIFICATES: {
    return {
      ...state,
      REACT_loading: true,
      confirmSet: { ...state.confirmSet, certificatesObjects: [] },
      error: false,
    };
  }
  case actions.GET_CONFIRMSET_CERTIFICATES_SUCCESS: {
    return {
      ...state,
      REACT_loading: false,
      error: false,
      confirmSet: { ...state.confirmSet, certificatesObjects: action.payload },
    };
  }
  case actions.GET_CONFIRMSET_CERTIFICATES_FAILURE: {
    return {
      ...state,
      REACT_loading: false,
      error: action.payload,
    };
  }

  case actions.GET_CONFIRMSETS_BY_ID: {
    return {
      ...state,
      REACT_loading: true,
      confirmSets: [],
      error: false,
    };
  }
  case actions.GET_CONFIRMSETS_BY_ID_SUCCESS: {
    return {
      ...state,
      REACT_loading: false,
      error: false,
      confirmSets: action.payload,
    };
  }
  case actions.GET_CONFIRMSETS_BY_ID_FAILURE: {
    return {
      ...state,
      REACT_loading: false,
      error: action.payload,
    };
  }


  case actions.UPDATE_CONFIRMSET: {
    return {
      ...state,
      REACT_loading: true,
      error: false,
    };
  }
  case actions.UPDATE_CONFIRMSET_SUCCESS: {
    return {
      ...state,
      REACT_loading: false,
      error: false,
      confirmSet: action.payload,
    };
  }
  case actions.UPDATE_CONFIRMSET_FAILURE: {
    return {
      ...state,
      REACT_loading: false,
      error: action.payload,
    };
  }


  case actions.UPDATE_CONFIRMSET_CERTIFICATES: {
    return {
      ...state,
      REACT_loading: true,
      error: false,
    };
  }
  case actions.UPDATE_CONFIRMSET_CERTIFICATES_SUCCESS: {
    return {
      ...state,
      REACT_loading: false,
      error: false,
      confirmSet: action.payload,
    };
  }
  case actions.UPDATE_CONFIRMSET_CERTIFICATES_FAILURE: {
    return {
      ...state,
      REACT_loading: false,
      error: action.payload,
    };
  }
  case actions.UPDATE_CONFIRMSET_SEGMENT: {
    return {
      ...state,
      REACT_loading: true,
      error: false,
    };
  }
  case actions.UPDATE_CONFIRMSET_SEGMENT_SUCCESS: {
    return {
      ...state,
      REACT_loading: false,
      error: false,
      confirmSet: { ...state.confirmSet,
        segments: state.confirmSet.segments.map((segment)=>(
          segment.id === action.payload.id ? action.payload : segment
        )),
      },
    };
  }
  case actions.UPDATE_CONFIRMSET_SEGMENT_FAILURE: {
    return {
      ...state,
      REACT_loading: false,
      error: action.payload,
    };
  }

  case actions.UPDATE_CONFIRMSET_SEGMENT_ITEM: {
    return {
      ...state,
      REACT_loading: true,
      error: false,
    };
  }
  case actions.UPDATE_CONFIRMSET_SEGMENT_ITEM_SUCCESS: {
    return {
      ...state,
      REACT_loading: false,
      error: false,
      confirmSet: { ...state.confirmSet,
        segments: state.confirmSet.segments.map((segment)=>(
          segment?.items.find(item => item.id === action.payload.id) ? segment :
            { ...segment,
              items: segment.items.map((item) => {
                return item.id === action.payload.id ? action.payload : item;
              }),
            }
        )),
      },
    };
  }
  case actions.UPDATE_CONFIRMSET_SEGMENT_ITEM_FAILURE: {
    return {
      ...state,
      REACT_loading: false,
      error: action.payload,
    };
  }

  case actions.CONFIRMSETS_LISTING: {
    return {
      ...state,
      REACT_loading: true,
      contact: {},
      error: false,
    };
  }
  case actions.CONFIRMSETS_LISTING_SUCCESS: {
    return {
      ...state,
      REACT_loading: false,
      error: false,
      confirmSets_listing: action.payload.data,
      confirmSets_listing_pagination: action.payload.pagination,

    };
  }
  case actions.CONFIRMSETS_LISTING_FAILURE: {
    return {
      ...state,
      REACT_loading: false,
      error: action.payload,
    };
  }

  case actions.CONFIRMSET_DROPDOWNVALUE: {
    return {
      ...state,
      REACT_loading: false,
      error: false,
      confirmSets_dropdown_value: action.payload.data,

    };
  }

  case actions.CONFIRMSETS_FILTERED_LIST: {
    return {
      ...state,
      REACT_loading: true,
      error: false,
      confirmSets_filtered_list: [],
    };
  }

  case actions.CONFIRMSETS_FILTERED_LIST_SUCCESS: {
    return {
      ...state,
      REACT_loading: false,
      error: false,
      confirmSets_filtered_list: action.payload.data,
      confirmSets_filtered_list_pagination: action.payload.pagination,
    };
  }

  case actions.CONFIRMSETS_FILTERED_LIST_FAILURE: {
    return {
      ...state,
      REACT_loading: false,
      error: action.payload,
    };
  }
  case actions.DELETE_CONFIRMSET_CONTACT: {
    return {
      ...state,
      REACT_loading: true,
      error: false,

    };
  }

  case actions.DELETE_CONFIRMSET_CONTACT_SUCCESS: {
    let contacts = JSON.parse(JSON.stringify(state?.confirmSet.contacts));
    contacts.splice(contacts.findIndex((i)=>{
      return i.id === action.payload.contactId;
    }), 1);
    return {
      ...state,
      REACT_loading: false,
      error: false,
      confirmSet: { ...state?.confirmSet,
        contacts }
      ,
      confirmSets: state?.confirmSets.map((item)=>{
        if (item.id !== action.payload.confirmSetId)
          return item;
        else {
          return { ...item, contacts };
        }
      }),
    };
  }

  case actions.DELETE_CONFIRMSET_CONTACT_FAILURE: {
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
