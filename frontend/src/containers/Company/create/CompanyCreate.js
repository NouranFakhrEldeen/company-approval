import React, { useState, useEffect } from 'react';
import '../styles/create.scss';
import { useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router-dom';
import { connect, useDispatch } from 'react-redux';
import { Input, Button } from '../../../components';
import { createCompany, getCompany, updateCompany } from '../../../redux/Copmany/actionCreator';
import * as _ from 'lodash';
import { withTranslation } from 'react-i18next';
import { capitalizeFirstWord } from '../../../helpers';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { toastr } from 'react-redux-toastr';
const companyCreate = ({
  // eslint-disable-next-line no-unused-vars
  t: translate,
  // eslint-disable-next-line no-unused-vars
  company,
  ReactLoading,
  error,
}) => {

  let history = useHistory();

  let { id } = useParams();


  const dispatch = useDispatch();
  const validationSchema = Yup.object().shape({
    companyName: Yup.string().required('companyName is required'),
    vatNumber: Yup.string().required('vat Number is required'),
  });

  const {
    // handleSubmit,
    // reset,
    errors,
    // formState,
    register } = useForm({
    resolver: yupResolver(validationSchema),
  });
  // resolver: yupResolver(validationSchema)
  const [companyProperties, setCompanyProperties] = useState({
    companyName: '',
    vatNumber: '',
  });
  const [isActive, setIsActive] = useState({});
  // eslint-disable-next-line no-unused-vars

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCompanyProperties({
      ...companyProperties,
      [name]: value,
    });
  };

  // fix create new company input not empty when enters the page for the first time
  useEffect(() => {
    setCompanyProperties({ ...companyProperties,
      companyName: '',
      vatNumber: '',
    });
  }, [ReactLoading]);

  useEffect(() => {
    dispatch(getCompany(id));


  }, [id]);

  useEffect(() => {
    let id = '';
    if (!_.isEmpty(company)) {
      id = company;
      if (isActive?.key && (error === false || error === null)) {
        history.push({ pathname: `/company/${id}/confirm-set/create`, state: { fromCompanyCreate: 'hamada' } });
      }
      else if (isActive?.key === false) {
        history.push({ pathname: '/Companies' });
      }
      // updating companies details
      setCompanyProperties({ ...companyProperties,
        companyName: company?.name,
        vatNumber: company?.businessId,
      });
    }
  }, [company]);

  const handleCreateCompany = () => {


    setIsActive({ ...isActive, key: true });
    if (id) {
      dispatch(updateCompany(companyProperties, id));
      if (company && (error === false || error === null))
      {
        toastr.success('success', 'company has been updated successfully');
      }
    } else {
      dispatch(createCompany(companyProperties));
      if (company && (error === false || error === null))
      {
        toastr.success('success', 'company has been added successfully');
      }

    }

  };

  const handleCreateAndReturnToCompanies = () => {

    setIsActive({ ...isActive, key: false });
    if (id) {
      dispatch(updateCompany(companyProperties, id));
    } else {
      dispatch(createCompany(companyProperties));

    }
  };

  const compCreateValidation = () => {
    if (companyProperties?.companyName === '' ||
    companyProperties?.companyName === undefined ||
     companyProperties?.vatNumber === '' ||
     companyProperties?.vatNumber === undefined) {
      return true;
    }
  };

  return (

    <div>
      <h3>{translate('newCompany')}</h3>
      <div className="sepatator" />
      <div className="form-row margin-top-25">
        <div className="form-group col-md-5 col-sm-10 ">
          <Input
            ref={register}
            type={'text'}
            placeholder={capitalizeFirstWord(translate('company-name'))}
            id={'id'}
            name={'companyName'}
            iconsBoolean
            icons={'fas fa-building'}
            onChange={(e) => handleChange(e)}
            value={companyProperties.companyName}
            classes={`form-control form-input-missing padding-left-40 ${errors.companyName ? 'is-invalid' : ''
              }`}
          />
          {errors.companyName && <span>{errors.companyName.message}</span>}
        </div>
        <div className="form-group col-md-4 col-sm-10 ">
          <Input
            ref={register}
            type={'text'}
            placeholder={capitalizeFirstWord(translate('vat_number'))}
            name={'vatNumber'}
            iconsBoolean
            icons={'fas fa-hashtag'}
            classes={`form-control form-input-missing padding-left-40 ${errors.companyName ? 'is-invalid' : ''
              }`}
            onChange={(e) => handleChange(e)}
            value={companyProperties.vatNumber}
          />
          {errors.vatNumber && <span>{errors.vatNumber.message}</span>}
        </div>

        <div className="sepatator" />

        <div className='row margin-top-10'>
          <div className=" col-md-8 col-sm-10 margin-bottom-20">
            <Button
              // disabled={formState.isSubmitting}
              disabled={compCreateValidation()}
              value={capitalizeFirstWord(translate('save_and_add_confirmation'))}
              iconsBoolean
              icons={'fas fa-plus'}
              classes={'btn border-radius-0 btn-primary width-100 btn-primary-disabled'}
              onClick={() => handleCreateCompany()}
            />
          </div>
          <div className=" col-md-8 col-sm-10">
            <Button
              // disabled={formState.isSubmitting}
              disabled={compCreateValidation()}
              value={capitalizeFirstWord(translate('save_and_return_to_companies'))}
              iconsBoolean
              icons={'fas fa-plus'}
              classes={'btn border-radius-0 btn-link width-100'}

              onClick={() => handleCreateAndReturnToCompanies()}
            />
          </div>
        </div>
      </div>
    </div>
    // </form>
  );
};

const mapStateToProps = (state) => {
  return {
    company: state?.companies?.company,
    ReactLoading: state?.companies?.REACT_loading,
    error: state?.companies?.error,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    createCompany: () => dispatch(createCompany()),
    updateCompany: ()=> dispatch(updateCompany()),
    getCompany: ()=> dispatch(getCompany()),
  };
};
export const CompanyCreate = connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(companyCreate));
