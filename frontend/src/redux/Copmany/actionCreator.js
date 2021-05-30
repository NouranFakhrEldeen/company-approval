import * as actions from './constants';
// import { createConfirmSet } from '../ConfirmSet/actionCreator';
import { CompaniesServiceFactory } from '../../services';
import rootReducer from '../rootReducer';
let CompaniesService = CompaniesServiceFactory.getInstance();

const defaultFilters = { size: 20 };

export function getAllCompanies(filters, page, oldCompanies) {
  return async (dispatch) => {
    try {
      dispatch({
        type: actions.GET_COMPANIES,
      });
      const Companies = await CompaniesService.filter({
        ...defaultFilters,
        ...filters,
        page,
      });
      const records = oldCompanies
        ? oldCompanies.concat(Companies.data.records)
        : Companies.data.records;
      dispatch({
        type: actions.GET_COMPANIES_SUCCESS,
        payload: { data: records, pagination: Companies.data.pagination },
      });
    } catch (error) {
      dispatch({
        type: actions.GET_COMPANIES_FAILURE,
        payload: error,
      });
    }
  };
}

export function getCompany(companyId) {
  return async (dispatch) => {
    try {
      dispatch({
        type: actions.GET_COMPANY,
      });
      let company = rootReducer.companies?.companies.find((company) => company.id === companyId);
      if (!company) {
        const res = await CompaniesService.getById(companyId);
        company = res.data;
      }
      dispatch({
        type: actions.GET_COMPANY_SUCCESS,
        payload: company,
      });
    } catch (error) {
      dispatch({
        type: actions.GET_COMPANY_FAILURE,
        payload: error,
      });
    }
  };
}

export function filterCompanies(filterationInput, page, oldCompanies) {
  return async (dispatch) => {
    try {
      dispatch({
        type: actions.FILTERED_COMPANIES,
      });
      const Companies = await CompaniesService.filter({
        ...defaultFilters,
        page,
        search: filterationInput,
      });
      const records = oldCompanies
        ? oldCompanies.concat(Companies.data.records)
        : Companies.data.records;
      dispatch({
        type: actions.FILTERED_COMPANIES_SUCCESS,
        payload: { data: records, pagination: Companies.data.pagination },
      });
    } catch (error) {
      dispatch({
        type: actions.FILTERED_COMPANIES_FAILURE,
        payload: error,
      });
    }
  };
}

export function emptyFilterCompanies(clear) {
  return async (dispatch) => {
    try {
      dispatch({
        type: actions.FILTERED_COMPANIES_SUCCESS,
        payload: { data: clear, pagination: {} },
      });
    } catch (error) {
      dispatch({
        type: actions.FILTERED_COMPANIES_FAILURE,
        payload: error,
      });
    }
  };
}

export function createCompany(company) {
  const newCompany = {
    name: company.companyName,
    businessId: company.vatNumber,
  };

  return async (dispatch) => {
    try {
      dispatch({
        type: actions.CREATE_COMPANY,
      });
      const response = await CompaniesService.create(newCompany);
      dispatch({
        type: actions.CREATE_COMPANY_SUCCESS,
        payload: response.data.id,
      });
    } catch (error) {
      dispatch({
        type: actions.CREATE_COMPANY_FAILURE,
        payload: error,
      });
    }
  };
}

export function updateCompany(company, id) {
  const updateCompany = {
    name: company.companyName,
    businessId: company.vatNumber,
  };

  return async (dispatch) => {
    try {
      dispatch({
        type: actions.CREATE_COMPANY,
      });
      const response = await CompaniesService.update(updateCompany, id);
      dispatch({
        type: actions.CREATE_COMPANY_SUCCESS,
        payload: response.data.id,
      });
    } catch (error) {
      dispatch({
        type: actions.CREATE_COMPANY_FAILURE,
        payload: error,
      });
    }
  };
}

// export function createConfirmSetSegment(segment) {
//   segment['confirmsetId'] = confirmsetId;

//   return async (dispatch) => {
//     try {
//       dispatch({
//         type: actions.CREATE_CONFIRMSET_SEGMENT,
//         payload: segment,
//       });
//       ConfrimSegmentService.create(segment);

//       dispatch({
//         type: actions.CREATE_CONFIRMSET_SEGMENT_SUCCESS,
//         payload: segment,
//       });
//     } catch (error) {
//       dispatch({
//         type: actions.CREATE_CONFIRMSET_SEGMENT_FAILURE,
//         payload: error,
//       });
//     }
//   };
// }

export function filterationInputs(value) {
  return (dispatch) => {
    try {
      dispatch({
        type: actions.FILTERED_INPUT,
        payload: value,
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };
}

export function clearSearchInput(value) {
  return (dispatch) => {
    try {
      dispatch({
        type: actions.CLEAR_SEARCH,
        payload: value,
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };
}
