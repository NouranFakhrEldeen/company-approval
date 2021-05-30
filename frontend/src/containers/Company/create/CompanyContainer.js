import React from 'react';
import '../styles/create.scss';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { Header } from '../../../components/';
import { createCompany } from '../../../redux/Copmany/actionCreator';
import { withTranslation } from 'react-i18next';
// import { capitalizeFirstWord } from '../../../helpers';
// import { CreateConfirmSet } from './CreateConfirmSet';
import { CompanyCreate } from './CompanyCreate';

const companyContainer = ({
  // eslint-disable-next-line no-unused-vars
  t: translate,
  // selectedSegment,
  company,
}) => {
  let history = useHistory();

  const cancelRedirect = () => {
    history.push({ pathname: '/Companies' });
  };

  // eslint-disable-next-line no-unused-vars
  return (
    <div>
      <Header
        title={translate('newCompany')}
        cancel={translate('cancel')}
        cancelBoolean
        iconsBoolean={false}
        icons={''}
        classes={''}
        cancelLinkFunction={cancelRedirect}
      />
      <div className="container m-auto wrapper p-3  margin-top-30-important  margin-bottom-20-important">
        <CompanyCreate company={company} />
        {/* <CreateConfirmSet company={company} selectedSegment={selectedSegment} /> */}
        {/* <div className="margin-top-30-important ">
          <Button
            onClick={() => {
              history.push('/Companies');
            }}
            value={translate('not-now')}
            classes={'btn border-radius-0 secondry-button '}
          />
        </div> */}
      </div>
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    company: state?.companies?.company,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    createCompany: () => dispatch(createCompany()),
  };
};
export const CompanyContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(companyContainer));
