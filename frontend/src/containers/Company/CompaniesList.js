import React, { useEffect, useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
// import Moment from 'react-moment';
import { connect, useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  getAllCompanies,
  filterCompanies,
  filterationInputs,
  emptyFilterCompanies,
  clearSearchInput,
} from '../../redux/Copmany/actionCreator';
// import InfiniteScroll from 'react-infinite-scroll-component';
import { withTranslation } from 'react-i18next';

import { capitalizeFirstWord, formatDate } from '../../helpers';
// reusable components

import {
  Header,
  Button,
  SearchInput,
  ViewFilters,
  InfiniteScrollComponent,
} from '../../components';

const companiesList = ({
  companies,
  filterationInput,
  filteredCompanies,
  t: translate,
  companiesPagination,
  filteredCompaniesPagination,
  ReactLoading,
}) => {

  const dispatch = useDispatch();
  const searchRef = useRef(null);
  const [previewedCompanies, setPreviewedCompanies] = useState([]);
  const [previewedCompaniesPagination, setPreviewedCompaniesPagination] = useState({});
  const [scrollLoading, setScrollLoading] = useState(false);

  useEffect(() => {
    if (!companiesPagination?.page) {
      dispatch(getAllCompanies({}, 1));
    }
    dispatch(filterationInputs(''));
  }, []);


  useEffect(() => {
    if (filterationInput !== '') {
      dispatch(filterCompanies(filterationInput, 1));
    } else {
      dispatch(emptyFilterCompanies([]));

    }
  }, [filterationInput]);


  useEffect(() => {
    const temp = (filterationInput?.length || filteredCompanies?.length)
      && previewedCompanies?.filter(item => item.name.includes(filterationInput))
      ? filteredCompanies : companies;
    const tempPagination = filteredCompanies?.length ? filteredCompaniesPagination : companiesPagination;

    if (scrollLoading) {
      setScrollLoading(false);
      setPreviewedCompanies(temp?.length ? [...temp] : previewedCompanies);
    } else {
      setPreviewedCompanies(temp?.length ? [...temp] : []);
    }
    setPreviewedCompaniesPagination({ ...tempPagination });

  }, [filteredCompanies, companies]);


  const cancelRedirect = () => {
    history.push({ pathname: '/' });

  };

  const addCompany = () => {
    history.push('/CompanyCreate');
  };


  const applySearchFilter = (e) => {
    dispatch(filterationInputs(e));

  };

  const navigateToCompanyView = (item) => {
    history.push(`/company/${item.id}`);
    dispatch(filterationInputs(''));
  };
  const clearSearchText = () => {
    dispatch(filterationInputs(''));
    // fix clear input search value
    searchRef.current.value = '';
    dispatch(clearSearchInput(true));
  };


  const handleScroll = () => {
    setScrollLoading(true);
    if (ReactLoading) {
      return;
    }
    if (filteredCompanies.length) {
      dispatch(filterCompanies(filterationInput, previewedCompaniesPagination.currentPage + 1, previewedCompanies));
    } else {
      dispatch(getAllCompanies({}, previewedCompaniesPagination.currentPage + 1, previewedCompanies));
    }
  };


  let history = useHistory();
  return (
    <div>
      <Header
        title={translate('companies-list')}
        cancel={translate('cancel')}
        cancelBoolean
        iconsBoolean={false}
        icons={''}
        classes={''}
        cancelLinkFunction={cancelRedirect} />

      <div className="companies-list margin-top-20 margin-bottom-20">
        <div className="row ml-3 ">
          <div className='padding-top-15 search-container tags-search-cont col-md-3 col-sm-4 with-separator'>
            <Button
              value={capitalizeFirstWord(translate('add-company'))}
              iconsBoolean
              icons={'fas fa-plus'}
              classes={'btn btn-success width-100 border-radius-0'}
              onClick={addCompany} />
            <div className="sepatator" />


            <div className="form-group mb-3">
              <div>
                <SearchInput
                  handleSearch={applySearchFilter}
                  ref={searchRef}
                  iconsBoolean
                  icons={'fas fa-search'}
                  className={'form-control form-input-missing padding-left-40'}
                />
              </div>
            </div>
          </div>

          <div className='result-container col-sm-8 col-md-9 '>
            {
              filterationInput.length > 0 &&
              <ViewFilters
                filters={previewedCompaniesPagination}
                searchInputValue={filterationInput}
                iconSearch={'fas fa-search'}
                clearTextSearch={clearSearchText}

              />
            }
            <h4>
              {companiesPagination?.total > 0 ?
                <span>{companiesPagination?.total < 2 ?
                  `${companiesPagination?.total} ${translate('Company')}` :
                  `${companiesPagination?.total} ${translate('Companies')}`}</span> :
                ''}
            </h4>
            <InfiniteScrollComponent
              next={handleScroll}
              dataLength={previewedCompanies?.length}
              hasMore={previewedCompaniesPagination?.totalPages > previewedCompaniesPagination?.currentPage}
              loader={(Object.keys(previewedCompaniesPagination).length && !previewedCompanies.length) &&
                <h4 className='align-center loading-text'>{capitalizeFirstWord(translate('loading'))}...</h4>}
              previewedPagination={previewedCompaniesPagination}
              previewed={[...previewedCompanies.map(item => ({
                header: item?.name,
                body: `${item.businessId}  ${
                  item.securityContractId && item.securityContractFrom && item.securityContractTo ?
                  // eslint-disable-next-line max-len
                  `${formatDate('dd.mm.yyyy', item.securityContractFrom)} - ${formatDate('dd.mm.yyyy', item.securityContractTo)}`
                    : ''
                } ${item.securityContractValid ? translate('valid') : ''}
                `,
                realItem: item,
              }))]}
              filterationInput={filterationInput}
              no_results={translate('no_results')}
              onClick={navigateToCompanyView}
            />
          </div>


        </div>
      </div>
    </div>

  );
};

const mapStateToProps = (state) => ({
  companies: state.companies.companies,
  filteredCompanies: state?.companies?.filteredCompanies,
  filterationInput: state?.companies?.filterationInput,
  companiesPagination: state?.companies?.companies_pagination,
  filteredCompaniesPagination: state?.companies?.filteredCompanies_pagination,
  ReactLoading: state?.companies?.REACT_loading,
  clearSearch: state?.companies?.clear_search,
});

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      getAllCompanies,
      filterCompanies,
      emptyFilterCompanies,
      filterationInputs,
      clearSearchInput,
    },
    dispatch
  );
};
export const CompaniesList = connect(mapStateToProps, mapDispatchToProps)(withTranslation()(companiesList));
