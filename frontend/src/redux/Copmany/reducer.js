import * as actions from './constants';
const initialState = {
  REACT_loading: false,
  companies: [],
  companies_pagination: {},
  error: null,
  selectedCompanyId: null,
  selectedCompany: null,
  company: {},
  filteredCompanies: [],
  filteredCompanies_pagination: {},
  filterationInput: '',
  clear_search: null,
};

export const companiesReducer = (state = initialState, action) => {
  switch (action.type) {
  case actions.GET_COMPANIES: {
    return {
      ...state,
      REACT_loading: true,
      companies: null,
      error: false,
    };
  }
  case actions.GET_COMPANIES_SUCCESS: {
    return {
      ...state,
      REACT_loading: false,
      error: false,
      companies: action.payload.data,
      companies_pagination: action.payload.pagination,
    };
  }
  case actions.GET_COMPANIES_FAILURE: {
    return {
      ...state,
      REACT_loading: false,
      error: action.payload,
    };
  }

  case actions.GET_COMPANY: {
    return {
      ...state,
      REACT_loading: true,
      company: {},
      error: false,
    };
  }
  case actions.GET_COMPANY_SUCCESS: {
    return {
      ...state,
      REACT_loading: false,
      error: false,
      company: action.payload,
    };
  }
  case actions.GET_COMPANY_FAILURE: {
    return {
      ...state,
      REACT_loading: false,
      error: action.payload,
    };
  }

  case actions.CREATE_COMPANY: {
    return {
      ...state,
      REACT_loading: true,
      company: {},
      error: false,
    };
  }
  case actions.CREATE_COMPANY_SUCCESS: {
    return {
      ...state,
      REACT_loading: false,
      error: false,
      company: action.payload,
    };
  }
  case actions.CREATE_COMPANY_FAILURE: {
    return {
      ...state,
      REACT_loading: false,
      error: action.payload,
    };
  }

  case actions.FILTERED_COMPANIES: {
    return {
      ...state,
      REACT_loading: true,
      error: false,
      filteredCompanies: [],
    };
  }

  case actions.FILTERED_COMPANIES_SUCCESS: {
    return {
      ...state,
      REACT_loading: false,
      error: false,
      filteredCompanies: action.payload.data,
      filteredCompanies_pagination: action.payload.pagination,
    };
  }

  case actions.FILTERED_COMPANIES_FAILURE: {
    return {
      ...state,
      REACT_loading: false,
      error: action.payload,
    };
  }

  case actions.FILTERED_INPUT: {
    return {
      ...state,
      filterationInput: action.payload,
    };
  }

  case actions.CLEAR_SEARCH: {
    return {
      ...state,
      clear_search: action.payload,
    };
  }


  default:
    return state;
  }
};
