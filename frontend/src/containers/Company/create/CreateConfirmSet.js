import React, { useEffect, useState } from 'react';
import '../styles/create.scss';
import { connect, useDispatch } from 'react-redux';
import * as reusableConsts from '../../../redux/ReusableComponents/constants';
import { withTranslation } from 'react-i18next';
import { ListGroup, Row, Col } from 'react-bootstrap';
import { Button, Input, RadioButtons, Checkbox, DatePickers } from '../../../components';
import { getSegments, selectSegment } from '../../../redux/Segment';
import { capitalizeFirstWord } from '../../../helpers';
import { createConfirmSet } from '../../../redux/ConfirmSet';
import { useContactComp } from './ContactForm';
import { useForm } from 'react-hook-form';
import { NotifyContact } from './NotifyContact';
import * as _ from 'lodash';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useHistory } from 'react-router-dom';
import { toastr } from 'react-redux-toastr';
const createConfirmSetForm = ({
  // eslint-disable-next-line no-unused-vars
  t: translate,
  segments,
  company: company,
  error,
  confirmSet,
  REACT_loading,
}) => {
  const dispatch = useDispatch();
  const [show, setState] = useState({});
  const [showNotifyList, setNotifyList] = useState(false);
  const [type, setType] = useState('');
  const [disable, setDisable] = useState(false);
  const [contactState, Contact] = useContactComp({ disable, type });
  const [selectedSegs, setSelectedSegs] = useState([]);
  // single datepicker
  const [datepicker, setDatepicker] = useState('');
  const [confirmSetProperties, setconfirmSetProperties] = useState({
    companyId: '',
    // remove "datepicker.toLocaleString()" and will be added approval date key by MOhsen
    startTime: Date().toLocaleString(),
    contacts: [],
    segments: [],
    // approvedTime: radioButtonValue === 'instantConfirmation' ? datepicker.toLocaleString() : undefined,
    // status: radioButtonValue === 'instantConfirmation' ? 'COMPLETED':
    approvedTime: '',
  });
  useEffect(() => {
    if (!_.isEmpty(company)) {
      setDisable(false);
    }

  }, [company]);

  const [ContactsList, setContactsList] = useState([]);
  const [radioButtonValue, setRadioButtonValue] = useState(undefined);


  let radioButtonsArray = [
    {
      value: 'standardProcess',
      label: capitalizeFirstWord(translate('standard_Process')),
    },
    {
      value: 'instantConfirmation',
      label: capitalizeFirstWord(translate('instant_Confirmation')),
    },
  ];

  useEffect(() => {
    dispatch(getSegments());
    // setting radioButton default value as standard process
    setRadioButtonValue(radioButtonsArray[0].value);
  }, []);


  let history = useHistory();
  function dynamicSort(property) {
    var sortOrder = 1;
    if (property[0] === '-') {
      sortOrder = -1;
      property = property.substr(1);
    }
    return function (a, b) {
      var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
      return result * sortOrder;
    };
  }

  const validationSchema = Yup.object().shape({
    postalCode: Yup.string().matches(/^\d{5}$/, capitalizeFirstWord(translate('postal_code_error_message'))),
  });

  const { handleSubmit, reset, register, errors,
    //  formState
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  function onSubmit() {

    if (!_.isEmpty(company) && !_.isEmpty(selectedSegs)) {

      confirmSetProperties.companyId = company;
      setContactsList([...ContactsList, contactState]);
      setconfirmSetProperties({
        ...confirmSetProperties,
        segments: [...selectedSegs.map((item) => ({ ...item, id: undefined }))],
        contacts: radioButtonValue === 'instantConfirmation' ? ContactsList.length ? [] : ContactsList : ContactsList,
        companyId: company,
        approvedTime: radioButtonValue === 'instantConfirmation' ? datepicker.toLocaleString() : undefined,
        // adding status 'COMPLETED' in case of instant approval,
        status: radioButtonValue === 'instantConfirmation' ? 'COMPLETED' : undefined,
      });
    }
  }


  useEffect(() => {

    if (confirmSetProperties.contacts?.length || confirmSetProperties?.approvedTime) {
      dispatch(createConfirmSet(confirmSetProperties));
    }
  }, [confirmSetProperties]);


  useEffect(() => {
    if ((confirmSetProperties.contacts?.length || confirmSetProperties?.approvedTime) && !REACT_loading) {
      if (confirmSet && !error)
      {
        toastr.success('success', 'confirmSet has been added successfully');

        history.push('/Companies');
      }
      if (error)
      {
        let temp = JSON.parse(JSON.stringify(ContactsList));
        temp.pop();
        temp.pop();
        setTimeout(() => {
          setContactsList([...temp]);

        }, 100);

        // history.push('/Companies');
      }
    }
  }, [REACT_loading]);


  const handleShowSegment = (index, item) => {
    if (!show[index]) {
      const tempSegment = {
        id: item.id,
        checklistId: item.checklistId,
        segmentId: item.id,
        name: item.name,
        type: item.type,
        items: item.items.map((elemnt) => ({
          name: elemnt.name,
          number: elemnt.number,
        })),
      };
      setSelectedSegs(selectedSegs.concat(tempSegment));
    } else {
      const filteredData = selectedSegs.filter((segItem) => segItem.id !== item.id);
      setSelectedSegs([...filteredData]);
    }
    if (_.isEmpty(show)) {
      setState({ ...show, [index]: false });
    }
    setState({ ...show, [index]: !show[index] });
  };


  const handleSegmentChange = (event, id) => {
    let { name, value } = event.target;
    if (name === 'postalCode' && value === '') {
      value = undefined;
    }
    const newItems = selectedSegs.map((segment) => {
      if (segment.id === id)
        segment[name] = value;
      return segment;
    });
    setSelectedSegs([...newItems]);
  };


  const renderSegment = (showdata, item, index) => {
    return (
      <div key={index} className="padding-0">
        <Row className="mb-2">
          {item.type === 'ADDRESS' &&
            <Col className='col-md-8 col-sm-10 '>
              <Input
                placeholder={capitalizeFirstWord(translate('address_alias'))}
                name={'addressAlias'}
                iconsBoolean={false}
                classes={`form-control ${errors.addressAlias ? 'is-invalid' : ''
                  }`}
                onChange={(e) => handleSegmentChange(e, item.id)}
                // ref={register}
              // disabled={disable}
              />
              {errors.addressAlias && <span>{errors.addressAlias.message}</span>}
            </Col>
          }
          {item.type === 'ROOM' &&
            <Col className='col-md-8 col-sm-10 '>
              <Input
                placeholder={capitalizeFirstWord(translate('room'))}
                name={'room'}

                classes={`form-control ${errors.room ? 'is-invalid' : ''
                  }`}
                onChange={(e) => handleSegmentChange(e, item.id)}
                ref={register}
              // disabled={disable}
              />
            </Col>
          }
        </Row>
        <Row className="mb-2">
          {item.type !== 'NORMAL' &&
            <div className='col-md-6 col-sm-10 '>
              <Input
                placeholder={capitalizeFirstWord(translate('street_address'))}
                name={'street'}
                iconsBoolean
                icons={'fas fa-map-marker-alt'}
                classes={`form-control form-input-missing padding-left-40 ${errors.street ? 'is-invalid' : ''
                  }`}
                onChange={(e) => handleSegmentChange(e, item.id)}
                ref={register}
              // disabled={disable}
              />
              {errors.street && <span>{errors.street.message}</span>}
            </div>
          }
        </Row>
        {item.type !== 'NORMAL' &&
          <Row className="mb-2">
            <div className='col-md-5 col-sm-10 '>
              <Input
                placeholder={capitalizeFirstWord(translate('city'))}
                name={'city'}
                iconsBoolean={false}
                classes={`form-control ${errors.city ? 'is-invalid' : ''}`}
                onChange={(e) => handleSegmentChange(e, item.id)}
                ref={register}
              // disabled={disable}
              />
              {errors.city && <span>{errors.city.message}</span>}
            </div>
            <div className='col-md-5 col-sm-10 '>
              <Input
                placeholder={capitalizeFirstWord(translate('postal_code'))}
                id={'id'}
                name={'postalCode'}
                iconsBoolean={false}
                classes={`form-control ${errors.postalCode ? 'is-invalid' : ''}`}
                onChange={(e) => handleSegmentChange(e, item.id)}
                // ref={register}
              // disabled={disable}
              />
              {errors.postalCode && <span>{errors.postalCode.message}</span>}
            </div>
          </Row>}
      </div>
    );
  };


  function onHandledata(notify) {
    setContactsList([...ContactsList, notify]);
    setNotifyList((showNotifyList) => !showNotifyList);
  }
  return (
    <form
      onSubmit={ handleSubmit(onSubmit)}
      onReset={reset}
      id='createConfirmSetForm'>
      <div className="">
        <h4 className='margin-top-15 margin-bottom-15'>
          {capitalizeFirstWord(translate('confirmation_of_safety_procedures'))}
        </h4>
        <div>
          <div className="radio-container margin-bottom-15 align-radio-label">
            <RadioButtons
              name1={reusableConsts.RADIOBTN_KEY}
              name2={reusableConsts.RADIOBTN_KEY}
              value={radioButtonValue}
              // options={[
              //   {
              //     value: 'standardProcess',
              //     label: capitalizeFirstWord(translate('standard_Process')),
              //   },
              //   {
              //     value: 'instantConfirmation',
              //     label: capitalizeFirstWord(translate('instant_Confirmation')),
              //   },
              // ]}
              options={radioButtonsArray}
              onChange={(e) => {
                setRadioButtonValue(e.target.value);
              }}

            />
          </div>
          <div>{Contact}</div>
        </div>
        {/* datepicker */}
        {
          radioButtonValue === 'instantConfirmation' &&
          <div className='row single-label-width'>
            <h4 className='col-md-12 col-sm-12'>{capitalizeFirstWord(translate('date'))}</h4>
            <div className='col-md-12 col-sm-12'>
              <DatePickers
                classesWrapper={'form-group datePickerFromTo padding-0 d-flex'}
                date={datepicker}
                onChange={(e) => setDatepicker(e)}
              />
            </div>
          </div>
        }


        <div className="sepatator" />
        {/* <div className="checkbox-container margin-bottom-15 margin-top-20 width-important">
          <label className="">
            <input
              className=" me-1"
              type="checkbox"
              value=""
              onChange={() => {
                setNotifyList((showNotifyList) => !showNotifyList);
                setType('NOTIFY');
              }}
            />
            <span>{capitalizeFirstWord(translate('notify_when_confirmation_completed'))}</span>
          </label>
        </div> */}
        <Checkbox
          containerClasses={`checkbox-container margin-bottom-15 margin-top-20 width-important 
          ${radioButtonValue === 'instantConfirmation' && 'd-none'}`}
          id="notify"
          testID="notify-id"
          name='notify-when-complete'
          checked={showNotifyList}
          spanValue={translate('notify_when_confirmation_completed')}
          onChange={() => {
            setNotifyList((showNotifyList) => !showNotifyList);
            setType('NOTIFY');
          }}
        />
        {showNotifyList ? (
          <NotifyContact
            type={type}
            onHandle={onHandledata}
          />
        ) : ('')}
      </div>
      <div>
        {ContactsList.length
          ? ContactsList.map((item, index) => {
            if (item.type === 'NOTIFY')
              return (
                <div key={`${item.name}_${index}`}>
                  <span>{item.name}</span>
                  <span>{item.email}</span>
                  <div className="sepatator" />
                </div>
              );
          })
          : ''}
      </div>
      <div className="form-group col-12 p-0 notify-segements">
        <h4 className='margin-top-15 margin-bottom-15'>Varmennettavat osuudet</h4>
        <ListGroup className="listGroupSegment" variant="flush">

          {
            segments

              ? segments.sort(dynamicSort('index')).map((item, index) => (

                <div key={`${item.name}_${index}`} >
                  {/* <div className="checkbox-container width-50-percent">
                  <label>
                    <input
                      className=" me-1"
                      type="checkbox"
                      value=""
                      id={item?.id}
                      onChange={() => {
                        handleShowSegment(index, item);
                        dispatch(selectSegment(item.id));
                      }}
                    />
                    <span htmlFor={item?.id}>{item.name}</span>
                  </label>
                </div> */}

                  <Checkbox
                    containerClasses={'checkbox-container width-50-percent'}
                    id="segment"
                    testID="segment-id"
                    name='segments'
                    // checked={showNotifyList}
                    spanValue={item.name}
                    onChange={() => {
                      handleShowSegment(index, item);
                      dispatch(selectSegment(item.id));
                    }}
                  />

                  {show[index] && (
                    <div key={`${item.name}_${index}`}>
                      {renderSegment(show[index], item, index)

                      }
                    </div>
                  )}
                  <div className="sepatator" />
                </div>
              ))
              : ''}
        </ListGroup>
      </div>
      <Button
        value={capitalizeFirstWord(translate('save'))}
        iconsBoolean
        // onClick={() => { }}
        onClick={() => {
          document
            .getElementById('createConfirmSetForm')
            .dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
        }}
        disabled={
          !(
            contactState?.name?.length && contactState?.email?.length && contactState?.phone?.length
            && selectedSegs?.length
          )
        }
        icons={'fas fa-plus'}
        type="submit"
        // disabled={formState.isSubmitting}
        classes={'btn border-radius-0 btn-primary'}
      />
    </form>
  );
};
const mapStateToProps = (state) => {
  return {
    segments: state?.segments?.segments,
    selectedSegment: state?.segments?.selectedSegment,
    error: state?.confirmSets?.error,
    confirmSet: state?.confirmSets?.confirmSet,
    REACT_loading: state?.confirmSets?.REACT_loading,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    selectSegment: () => dispatch(selectSegment()),
  };
};
export const CreateConfirmSet = connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(createConfirmSetForm));
