import React, { useEffect, useState } from 'react';
// styles
// import './styles/confirmSet.scss';
import '../ConfirmSet/styles/confirmSet.scss';
// react
import { useHistory } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { connect, useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
// action creators
import {
  confirmSetListing,
  emptyFilterConfirmSet,
  filterConfirmSet,
  confirmSetDropDownValue,
} from '../../redux/ConfirmSet/actionCreator';

// filters file
import { DeviationFilteration } from './DeviationFilteration';

// services
import { AuthenticationServiceFactory } from '../../services';

const authorizationService = AuthenticationServiceFactory.getInstance();

// reusable components
import { Header, ViewFilters, InfiniteScrollComponent } from '../../components';
import * as Roles from '../../shared/role.constant';
import { formatDate } from '../../helpers';
const confirmSetListDeviation = ({
  t: translate,
  confirmSets,
  confirmSetPagination,
  ReactLoading,
  filteredCompaniesDropdown,
  filteredCompaniesDropdownPagination,
  hasRole,
}) => {
  // local state
  const [previewedConfirmSet, setpreviewedConfirmSet] = useState([]);
  const [
    previewedConfirmSetPagination,
    setPreviewedConfirmSetPagination,
  ] = useState({});
  const [confirmCompanies, setConfirmCompanies] = useState([]);
  const [companiesDropDown, setCompaniesDropDown] = useState({
    label: null,
    value: null,
    key: null,
  });

  //////// date filteration ///////////
  const [dateFilteration, setDateFilteration] = useState({
    from: '',
    to: '',
    inDeviationTime: '',
  });

  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [inDeviationTime, setInDeviationTime] = useState('');
  const [dropDownDateFilters, setDropDownDateFilters] = useState([]);

  //////// radioButtons list filteration ////////
  const [confirmSetFilteration, setConfirmSetFilteration] = useState(
    'IN_DEVIATION_FIXING'
  );

  const [scrollLoading, setScrollLoading] = useState(false);

  // dropdown filteration , unique companies no repeat
  let ObjectUnique = new Set();
  const companiesArrDropDownFilter = filteredCompaniesDropdown.filter((el) => {
    const duplicate = ObjectUnique.has(el.companyId);
    ObjectUnique.add(el.companyId);
    return !duplicate;
  });

  let history = useHistory();

  const dispatch = useDispatch();

  useEffect(() => {
    if (!confirmSetPagination?.page && hasRole([Roles.ADMIN])) {
      dispatch(confirmSetListing({}, 1, confirmSetFilteration));
    } else {
      dispatch(confirmSetListing({}, 1, 'IN_DEVIATION_FIXING,IN_DEVIATION_PROCESSING'));
    }
    dispatch(confirmSetDropDownValue({}, 1));
  }, [confirmSets.length]);

  useEffect(() => {
    if (hasRole([Roles.ADMIN])) {
      if (companiesDropDown.label !== null) {
        dispatch(filterConfirmSet({ companyId: companiesDropDown.value, page: 1 }));

      } else if (
        (dateFilteration.from !== '' && dateFilteration.to !== '') ||
        confirmSetFilteration

      ) {

        dispatch(filterConfirmSet({


          companyId: companiesDropDown?.value,
          page: 1,

          fromInDeviationTime: dateFilteration.from !== '' ? dateFilteration.from : undefined,
          toInDeviationTime: dateFilteration.to !== '' ? dateFilteration.to : undefined,
          confirmSetFilteration }, []));
      }
    }
  }, [
    companiesDropDown.label,
    dateFilteration?.from,
    dateFilteration?.to,
    dateFilteration?.inDeviationTime,
    confirmSetFilteration,
  ]);

  useEffect(() => {
    if (hasRole([Roles.ADMIN])) {
      const radioButtonsFilteration =
        confirmSetFilteration &&
        previewedConfirmSet.filter(
          (obj) => obj?.status === confirmSetFilteration
        )
          ? filteredCompaniesDropdown
          : confirmSets;

      const dropDownDateFilteration =
        (filteredCompaniesDropdown?.length ||
          (dateFilteration.from !== '' && dateFilteration.to !== '')) &&
        radioButtonsFilteration.filter(
          (obj) =>
            obj.company.name === companiesDropDown?.label ||
            (obj.inDeviationTime >= dateFilteration?.from &&
              obj.inDeviationTime <= dateFilteration?.to)
          ||
          obj.inDeviationTime == dateFilteration?.inDeviationTime
        )
          ? filteredCompaniesDropdown
          : confirmSets;

      setDropDownDateFilters(dropDownDateFilteration);

      const tempPagination = filteredCompaniesDropdown?.length
        ? filteredCompaniesDropdownPagination
        : confirmSetPagination;

      if (scrollLoading) {
        setScrollLoading(false);
        setpreviewedConfirmSet(
          radioButtonsFilteration?.length
            ? [...radioButtonsFilteration]
            : dropDownDateFilteration?.length && radioButtonsFilteration?.length
              ? [...dropDownDateFilteration]
              : previewedConfirmSet
        );
      } else {
        setpreviewedConfirmSet(
          radioButtonsFilteration?.length
            ? [...radioButtonsFilteration]
            : dropDownDateFilteration?.length && radioButtonsFilteration?.length
              ? [...dropDownDateFilteration]
              : []
        );
      }

      setPreviewedConfirmSetPagination({ ...tempPagination });
      setConfirmCompanies(...confirmSets?.map((item) => item?.company));
    } else {
      setpreviewedConfirmSet(confirmSets);
      setPreviewedConfirmSetPagination({ ...confirmSetPagination });
    }
  }, [
    filteredCompaniesDropdown,
    confirmSets,
    companiesDropDown,
    confirmSetFilteration,
  ]);

  const handleScroll = () => {
    setScrollLoading(true);
    if (ReactLoading) {
      return;
    }
    if (hasRole(['service-provider'])) {
      dispatch(
        confirmSetListing(
          {},
          previewedConfirmSetPagination.currentPage + 1,
          undefined,
          previewedConfirmSet
        )
      );
    } else if (hasRole([Roles.ADMIN])) {
      dispatch(filterConfirmSet(

        {
          companyId: companiesDropDown?.value === null ? undefined : companiesDropDown?.value,
          page: previewedConfirmSetPagination.currentPage + 1,

          fromInDeviationTime: dateFilteration.from !== '' ? dateFilteration.from : undefined,
          toInDeviationTime: dateFilteration.to !== '' ? dateFilteration.to : undefined,
          confirmSetFilteration }, previewedConfirmSet,));
    }
  };

  const cancelRedirect = () => {
    history.push({ pathname: '/' });
  };
  const navigateToConfirmSet = (item) => {
    history.push(`/confirm-set/${item.id}/deviations`);
  };
  // variable for adding and hiding classes to enlarge right container when role service-provider
  let leftContainer = document.querySelector('.search-container');

  /********************All Functions Related to Role Admin*************************/

  let companiesDropdown,
    clearSearchText,
    datePickerFromOnChange,
    datePickerToOnChange,
    handleChangeRadioBtnList,
    datePickerInDeviationOnChange;

  if (hasRole([Roles.ADMIN])) {
    // companies dropdown
    companiesDropdown = (e, action) => {
      if (action === 'clear') {
        dispatch(emptyFilterConfirmSet());
      }
      setCompaniesDropDown({
        ...companiesDropDown,
        label: e?.label,
        value: e?.value,
        key: e?.key,
      });
    };

    // clear search text
    clearSearchText = (e, id) => {
      dispatch(emptyFilterConfirmSet());
      if (id === 'searchTerm') {
        setCompaniesDropDown({
          ...companiesDropDown,
          label: null,
          value: null,
          key: null,
        });
      } else if (id === 'from') {
        setFromDate('');
        setDateFilteration({
          ...dateFilteration,
          from: '',
        });
      } else if (id === 'to') {
        setToDate('');
        setDateFilteration({
          ...dateFilteration,
          to: '',
        });
      } else if (id === 'inDeviationTime') {
        setInDeviationTime('');
        setDateFilteration({
          ...dateFilteration,
          inDeviationTime: '',
        });
      }
    };
    datePickerFromOnChange = (e) => {
      const formatFromDate = e;
      setDateFilteration({ ...dateFilteration, from: formatFromDate });
      setFromDate(formatFromDate);
    };

    datePickerToOnChange = (e) => {
      const formatToDate = e;
      setDateFilteration({ ...dateFilteration, to: formatToDate });
      setToDate(formatToDate);
    };
    handleChangeRadioBtnList = (event) => {
      const { value } = event.target;
      setConfirmSetFilteration(value);
    };
    datePickerInDeviationOnChange = (e) => {
      const value = e;
      setDateFilteration({ ...dateFilteration, inDeviationTime: value });
      setInDeviationTime(value);
    };
  }

  return (
    <div>
      <Header
        title={translate('DeviationsInAudits')}
        cancel={translate('cancel')}
        cancelBoolean
        iconsBoolean={false}
        icons={''}
        classes={''}
        cancelLinkFunction={cancelRedirect}
      />
      <div className="companies-list margin-top-20">
        <div className="row margin-0">
          {/* left container */}
          {hasRole([Roles.ADMIN]) ? (
            <div className="col-4 search-container left-container-filteration padding-top-20 filteration-datePickers">
              <DeviationFilteration
                // radioButtonListFilteration
                radioSelectedValue={confirmSetFilteration}
                onChange={handleChangeRadioBtnList}
                statusCount={confirmSetPagination?.statusCount}
                // dropdown filteration
                options={companiesArrDropDownFilter.map((item, index) => ({
                  label: item.company.name,
                  value: item.company.id,
                  key: index,
                }))}
                value={
                  companiesDropDown?.label === null
                    ? translate('Company')
                    : companiesDropDown
                }
                placeholder={translate('Company')}
                name={translate('Company')}
                applyFilter={companiesDropdown}
                // DatePicker Component
                classesWrapper={'form-group datePickerFromTo padding-0 d-flex'}
                fromDate={dateFilteration?.from}
                toDate={dateFilteration?.to}
                inDeviationTime={dateFilteration?.inDeviationTime}
                datePickerFromOnChange={datePickerFromOnChange}
                datePickerToOnChange={datePickerToOnChange}
                datePickerInDeviationOnChange={datePickerInDeviationOnChange}
              />
            </div>
          ) : null}

          {/* right container */}
          <div
            className={`result-container ${
              leftContainer?.classList?.contains('left-container-filteration')
                ? 'col-8'
                : 'col-12 padding-right-20-important'
            }`}>
            {(companiesDropDown.label ||
              dateFilteration.inDeviationTime ||
              dateFilteration.from ||
              dateFilteration.to) && (
              <ViewFilters
                filters={previewedConfirmSetPagination}
                searchInputValue={companiesDropDown.label}
                iconSearch={'fas fa-search'}
                clearTextSearch={clearSearchText}
                dateFilteration={dateFilteration}
                fromDate={fromDate}
                toDate={toDate}
                inDeviationTime={inDeviationTime}
              />
            )}
            <InfiniteScrollComponent
              // previewed={previewedConfirmSet}
              previewed={[
                ...previewedConfirmSet.map((item) => ({
                  header: `${item?.company?.name} ${formatDate('dd.mm.yyyy', item?.auditedTime) }`,
                  body: `${translate('Findings')} : ` +
                 `${item?.segments?.reduce((previous, current)=> current?.deviations?.filter(
                   (deviation)=> deviation?.status === 'APPROVED')?.length, 0)}  ` +
                  ` ${translate('fixed')} ` +

                  `${item?.segments?.reduce((previous, current)=> previous + current?.deviations?.filter(
                    (deviation)=> deviation?.status === 'WAITING_APPROVE')?.length, 0)} ` +
                  ` ${translate('waiting')}`,
                  realItem: item,
                })),
              ]}
              dataLength={previewedConfirmSet?.length}
              onClick={navigateToConfirmSet}
              next={handleScroll}
              hasMore={
                hasRole([Roles.ADMIN])
                  ? previewedConfirmSetPagination?.totalPages >
                    previewedConfirmSetPagination?.currentPage
                  : confirmSetPagination?.totalPages >
                    confirmSetPagination?.currentPage
              }
              previewedPagination={previewedConfirmSetPagination}
              confirmCompanies={confirmCompanies}
              no_results={translate('no_results')}
              //   radioFilters={confirmSetFilteration}
              dropDownDateFilters={dropDownDateFilters}
              roles={hasRole([Roles.ADMIN]) ? Roles.ADMIN : 'service-provider'}
              deviation
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  confirmSets: state?.confirmSets?.confirmSets_listing,
  confirmSetPagination: state?.confirmSets?.confirmSets_listing_pagination,
  ReactLoading: state?.confirmSets?.REACT_loading,
  filteredCompaniesDropdown: state?.confirmSets?.confirmSets_filtered_list,
  filteredCompaniesDropdownPagination:
    state?.confirmSets?.confirmSets_filtered_list_pagination,
  confirmSetDropDownValues: state?.confirmSets?.confirmSets_dropdown_value,
  hasRole: authorizationService.hasRole,
  getUserRole: authorizationService.getUserRole,
});

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      confirmSetListing,
      emptyFilterConfirmSet,
      filterConfirmSet,
      confirmSetDropDownValue,
    },
    dispatch
  );
};

export const ConfirmSetListDeviation = connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(confirmSetListDeviation));
