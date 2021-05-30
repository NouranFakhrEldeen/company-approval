import React, { useEffect, useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import { withTranslation } from 'react-i18next';
import { getCompany } from '../../redux/Copmany';
import { getSegments } from '../../redux/Segment';
import { getConfirmSetsById, getConfirmSet } from '../../redux/ConfirmSet';
import { Header, Input, Button } from '../../components';
import { capitalizeFirstWord, formatDate } from '../../helpers';
import { connect, useDispatch } from 'react-redux';
import {
  RoundReportsServiceFactory,
  AuthenticationServiceFactory,
} from '../../services';
import Moment from 'react-moment';
// eslint-disable-next-line no-unused-vars
import * as _ from 'lodash';
import download from 'downloadjs';
import i18n from '../../i18n';
import * as Roles from '../../shared/role.constant';


const roundReportService = RoundReportsServiceFactory.getInstance();
const authorizationService = AuthenticationServiceFactory.getInstance();

// eslint-disable-next-line no-empty-pattern
function companyView({
  hasRole,
  getCompany,
  company,
  match,
  t: translate,
  confirmSets,
  getConfirmSetsById,
  segments,
  roundReportService,
}) {
  const id = match.params.id;
  let history = useHistory();
  const dispatch = useDispatch();
  const [normalSegs, setNormalSegs] = useState([]);
  const [addressRoomSegs, setAddressRoomSegs] = useState([]);
  const [physicalSegs, setPhysicalSegs] = useState([]);
  const [physicalConfirmSets, setPhysicalConfirmSets] = useState([]);
  let physicalSegsNumber = {};
  // let physicalConfirmSets ;
  let refInput = useRef(null);
  useEffect(() => {
    id && getCompany(id);
    if (id) { confirmSets && getConfirmSetsById(id); }
  }, [id]);
  const cancelRedirect = () => {
    history.push({ pathname: '/Companies' });
  };
  const handelClick = () => {
    history.push({ pathname: `/company/view/${id}/confirm-set/create` });
  };

  useEffect(() => {
    dispatch(getSegments());
    dispatch(getConfirmSet());

  }, []);

  useEffect(() => {
    setNormalSegs(segments?.filter(segment => segment?.type === 'NORMAL') || []);
    setAddressRoomSegs(segments?.filter(segment => (segment?.type === 'ADDRESS' || segment?.type === 'ROOM')) || []);
  }, [segments]);


  const downloadReport = async (auditRoundId)=>{
    // TODO: remove service from this file and add it to redux
    const response = await roundReportService.getById(`${auditRoundId}/${i18n.language}`, { siteId: 'audit' });
    const content = response.headers['content-type'];
    let name = `${company.name}_${new Date().getTime()}.pdf`;
    download(response.data, name, content);
  };


  useEffect(() => {


    let physicals = confirmSets.map(confirmSet => confirmSet?.segments
      .filter(segment => (segment?.type === 'ADDRESS' || segment?.type === 'ROOM') && segment?.status === 'APPROVED'))
      .filter(item=> item?.length);
    let result = physicals.flat()?.map(element => ({
      name: element?.name,
      city: element?.city,
      addressAlias: element?.addressAlias,
      postalCode: element?.postalCode,
      street: element?.street,
      deviations: element?.deviations,
    }));


    setPhysicalSegs(result.filter((v, i, a)=>a.findIndex(t=>(t.name === v.name
        && t.street === v.street
        && t.city === v.city
        && t.addressAlias === v.addressAlias
        && t.postalCode === v.postalCode
    )) === i).filter((v, i, a)=>a.findIndex(t=>(JSON.stringify(t) === JSON.stringify(v))) === i));


    setPhysicalConfirmSets(confirmSets?.filter(confirmSet =>
      confirmSet?.segments?.find(segment => segment?.type === 'ADDRESS' || segment?.type === 'ROOM')));


  }, [confirmSets]);

  const accumulator = (obj, key) => {
    obj[key]++;
    return '';
  };

  // const showContracts = ()=> {
  //   let menu = document.querySelector('.contract-list-cont');
  //   menu.classList.toggle('d-none');

  // };


  return (
    <div>
      <Header
        title={company.name}
        cancel={translate('cancel')}
        cancelBoolean
        iconsBoolean={false}
        icons={''}
        classes={''}
        cancelLinkFunction={cancelRedirect}
      />
      <div className="container m-auto wrapper p-3  margin-top-30-important  margin-bottom-20-important">
        <div className="row inputs-wrapper">
          <div className=" col-md-5 col-sm-10 ">
            <Input
              type={'text'}
              placeholder={capitalizeFirstWord(translate('company-name'))}
              id={'id'}
              name={'companyName'}
              iconsBoolean
              icons={'fas fa-building'}
              value={company.name}
              disabled
              classes="form-control form-input-missing padding-left-40"
              ref={refInput}
              onChange={''}
            />
          </div>
          <div className="form-group col-md-4 col-sm-10 ">
            <Input
              type={'text'}
              placeholder={capitalizeFirstWord(translate('vat_number'))}
              name={'vatNumber'}
              id={'id'}
              iconsBoolean
              icons={'fas fa-hashtag'}
              classes="form-control form-input-missing padding-left-40"
              value={company.businessId}
              disabled
              onChange={''}
            />

          </div>
        </div>
      </div>
      {/* safety contract card - commented  till we have it with real data*/}
      {
        company.securityContractFrom && company.securityContractTo && company.securityContractId &&
        <div className=" container m-auto wrapper p-3  margin-top-30-important  margin-bottom-20-important row">
          <div className=" col-md-4 col-sm-10 title-lineHeight">
            <h3>{capitalizeFirstWord(translate('safety_contract'))}</h3>
          </div>
          <div className=" col-md-4 col-sm-10 margin-top-10">
            <label>{capitalizeFirstWord('valid:')}</label>
            <label className='margin-left-10'>
              <Moment format="DD.MM.YYYY">
                {company.securityContractFrom ? company.securityContractFrom : 'from data'}
              </Moment>
              <span> - </span>
              <Moment format="DD.MM.YYYY">{company.securityContractTo ? company.securityContractTo : 'to data'}</Moment>
            </label>
          </div>
          <div className=" col-md-4 col-sm-10 margin-top-10">
            <label>{capitalizeFirstWord('id:')}</label>
            <label className='margin-left-10'>{company.securityContractId ? company.securityContractId : 'id'}</label>
          </div>
          <div className='clear' />
        </div>
      }
      {
        hasRole([Roles.ADMIN]) && company?.securityContracts?.length &&
      <div className='container m-auto wrapper p-3  margin-top-30-important  margin-bottom-20-important row'>
        <div className='security-contract-list'>
          <div>
            {/* <button className='showBtn btn border-radius-0 btn-primary margin-top-15 margin-top-15 margin-bottom-10'
                  onClick={()=> showContracts()}>{translate('show_safety_contracts')}</button> */}
            <h3>{capitalizeFirstWord(translate('show_safety_contracts'))}</h3>
            <div className='contract-list-cont'>
              {/* <h5 className='black'>{translate('contracts_list')}</h5> */}
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th scope="col">{translate('contract_name')}</th>
                    <th scope="col"> {translate('contract_number')}</th>
                    <th scope="col">{translate('startDate')}</th>
                    <th scope="col">{translate('endDate')}</th>
                  </tr>
                </thead>
                <tbody>
                  { company?.securityContracts?.map(singleContract =>
                    <tr key={singleContract?.id} >
                      <td>{capitalizeFirstWord(singleContract?.contract_name)}</td>
                      <td>
                        {capitalizeFirstWord(singleContract?.contract_number)}</td>
                      <td>
                        {formatDate('dd.mm.yyyy', singleContract?.startdate)}
                      </td>
                      <td>
                        {formatDate('dd.mm.yyyy', singleContract?.enddate)}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

            </div>

          </div>
        </div>
      </div>
      }

      <div className="row container m-auto padding-0 row-horizontal-2-children margin-bottom-20 left-comp">
        <div className="col-md-6 col-sm-12 wrapper padding-15" >
          <h3>{capitalizeFirstWord(translate('general_safety'))}</h3>
          <div className="sepatator" />
          {normalSegs?.map((segment) => {
            let confirmsetss = confirmSets?.filter((confirmSet)=> confirmSet?.segments
              .find(item => item?.segmentId === segment?.id && item?.status === 'APPROVED'))
              .sort((a, b) => new Date(b.approvedTime) - new Date(a.approvedTime));
            return (
              <div key={`${segment?.id}_${Math.random()}`} className='segment-item'>
                <span className='box-title'>{segment?.name}</span>
                {confirmsetss?.length ?
                  confirmsetss?.map(confirmset => {
                    return (
                      <div key={`${segment?.id}_${Math.random()}`}>
                        {
                          confirmset ?
                            <div>
                              {

                                <div key={`${confirmset?.id}_${Math.random()}`}>

                                  <ul className='padding-LR-20'>
                                    {confirmset?.approvedTime || confirmset?.inDeviationTime
                                    && segment?.status === 'COMPLETED' ?
                                      <li >
                                        {
                                          confirmset?.approvedTime ?
                                            <Moment format="DD.MM.YYYY">{confirmset?.approvedTime}</Moment>
                                            : ''
                                        }
                                        <button
                                          onClick={()=>{ history.push(`/confirm-set/${confirmset.id}/report/view`);}}
                                          className='no-border report-button margin-left-10'>
                                          <span className='d-inline-block margin-left-10'>
                                            {capitalizeFirstWord(translate('report'))}
                                          </span>
                                          <span
                                            className='fal fa-external-link black-color d-inline-block margin-left-5' />
                                        </button>
                                        {
                                          confirmset?.auditRoundId !== null &&
                                          <button
                                            onClick={()=> downloadReport(confirmset?.auditRoundId)}
                                            className='no-border report-button margin-left-10'>
                                            <span >{capitalizeFirstWord(translate('audit_report'))}</span>
                                            <span
                                              className={`fal fa-external-link black-color 
                                              d-inline-block margin-left-5`}/>
                                          </button>
                                        }


                                      </li> : null
                                    }
                                  </ul>
                                </div>


                              }


                              {/* : <div>{capitalizeFirstWord(translate('not_confirm_set_available'))}</div> */}

                            </div>
                            : null
                        }
                      </div>
                    );
                  })
                    .slice(0, 2)

                  : <li className='list-position-inside'>{capitalizeFirstWord(translate('none_available'))}</li>
                }
              </div>
            );


          })}


        </div>
        {/* type ADDRESS,ROOM */}
        <div className="col-md-6 col-sm-12 wrapper padding-15" >
          <h3>{capitalizeFirstWord(translate('physical_safety'))}</h3>
          <div className="sepatator" />
          {/* the new ones */}
          {addressRoomSegs.filter(addressRoomSegment => !confirmSets?.find((confirmSet)=> confirmSet?.segments
            .find(item => item?.segmentId === addressRoomSegment?.id
              && item?.status === 'APPROVED')))?.map((segment) => {
            let confirmsetss = confirmSets?.filter((confirmSet)=> confirmSet?.segments
              .find(item => item?.segmentId === segment?.id && item?.status === 'APPROVED'))
              .sort((a, b) => new Date(b.approvedTime) - new Date(a.approvedTime));
            return (
              <div key={`${segment?.id}_${Math.random()}`} className='segment-item'>
                {/* <span className='box-title'>{segment?.name}</span> */}
                <span>
                  <span className='box-title'>{segment?.name}
                    {segment?.status === 'APPROVED' && <span className='box-title'>:</span>}
                  </span>
                  {
                    segment?.status === 'APPROVED' ?
                      <span className='box-title metadata-size'>
                        {segment?.street} &nbsp;
                        {segment?.addressAlias} &nbsp;
                        {/* {segment?.room } */}
                        {segment?.postalCode} &nbsp;
                        {segment?.city}
                      </span>
                      : ''
                  }
                </span>
                {confirmsetss?.length ?
                  confirmsetss?.map(confirmset => {
                    return (
                      <div key={`${segment?.id}_${Math.random()}`}>
                        {
                          confirmset ?
                            <div>
                              {
                                <div key={`${confirmset?.id}_${Math.random()}`}>

                                  <ul className='padding-LR-20'>
                                    {confirmset?.approvedTime || confirmset?.inDeviationTime
                                    && segment?.status === 'COMPLETED' ?
                                      <li >
                                        {
                                          confirmset?.approvedTime ?
                                            <Moment format="DD.MM.YYYY">{confirmset?.approvedTime}</Moment>
                                            : ''
                                        }
                                        <button
                                          onClick={()=>{ history.push(`/confirm-set/${confirmset.id}/report/view`);}}
                                          className='no-border report-button margin-left-10'>
                                          <span className='d-inline-block margin-left-10'>
                                            {capitalizeFirstWord(translate('report'))}
                                          </span>
                                          <span
                                            className='fal fa-external-link black-color d-inline-block margin-left-5' />
                                        </button>
                                        {
                                          confirmset?.auditRoundId &&
                                          <button
                                            onClick={()=> downloadReport(confirmset?.auditRoundId)}
                                            className='no-border report-button margin-left-10'>
                                            <span >{capitalizeFirstWord(translate('audit_report'))}</span>
                                            <span
                                              className={`fal fa-external-link black-color 
                                              d-inline-block margin-left-5`}/>
                                          </button>
                                        }


                                      </li> : null
                                    }
                                  </ul>
                                </div>


                              }


                              {/* : <div>{capitalizeFirstWord(translate('not_confirm_set_available'))}</div> */}

                            </div>
                            : null
                        }
                      </div>
                    );
                  })

                  : <li className='list-position-inside'>{capitalizeFirstWord(translate('none_available'))}</li>
                }
              </div>
            );


          })}
          {physicalSegs?.length ?
            physicalSegs?.map((physicalsegment) => {
              return (
                <div key={Math.random() * 0.2} className='segment-item'>
                  <span className='display-segment-data'>
                    {
                      physicalSegsNumber[`${physicalsegment?.name}_${physicalsegment?.street}_${physicalsegment?.addressAlias}_${physicalsegment?.postalCode}_${physicalsegment?.city}`] = 0 || ''
                    }
                    <span className='box-title box-title-cont'>{physicalsegment?.name}
                      {<span className='box-title'>:</span>}
                    </span>
                    {
                      <span className='box-title metadata-size'>
                        {physicalsegment?.street} &nbsp;
                        {physicalsegment?.addressAlias} &nbsp;
                        {/* {physicalsegment?.room } */}
                        {physicalsegment?.postalCode} &nbsp;
                        {physicalsegment?.city}
                      </span>
                    }
                  </span>
                  {
                    physicalSegs?.length ?
                      physicalConfirmSets?.length ?
                        physicalConfirmSets?.sort((a, b) => new Date(b.approvedTime) - new Date(a.approvedTime))
                          ?.map(item =>
                            item?.segments.filter(segments =>(segments?.type === 'ADDRESS' || segments?.type === 'ROOM')
                          && segments?.status === 'APPROVED')
                              .filter((v, i, a)=>a.findIndex(t=>(t.name === v.name
                                      && t.street === v.street
                                      && t.city === v.city
                                      && t.addressAlias === v.addressAlias
                                      && t.postalCode === v.postalCode
                              )) === i)
                              .map((segment) => {
                                return (
                                  <div key={`${segment?.id}_${Math.random()}`}>
                                    {
                                      (
                                        physicalsegment?.name === segment?.name &&
                                    physicalsegment?.street === segment?.street &&
                                    physicalsegment?.city === segment?.city &&
                                    physicalsegment?.addressAlias === segment?.addressAlias &&
                                    physicalsegment?.postalCode === segment?.postalCode &&
                                    physicalSegsNumber[`${physicalsegment?.name}_${physicalsegment?.street}_${physicalsegment?.addressAlias}_${physicalsegment?.postalCode}_${physicalsegment?.city}`] < 2
                                      ) ?
                                        <div>
                                          {accumulator(physicalSegsNumber, `${physicalsegment?.name}_${physicalsegment?.street}_${physicalsegment?.addressAlias}_${physicalsegment?.postalCode}_${physicalsegment?.city}`)}
                                          <ul className='padding-LR-20'>
                                            <li>
                                              {
                                                item?.approvedTime ?
                                                  <Moment format="DD.MM.YYYY">{item?.approvedTime}</Moment>
                                                  : ''
                                              }
                                              <button
                                                onClick={()=>{ history.push(`/confirm-set/${item.id}/report/view`);}}
                                                className='no-border report-button margin-left-10'>
                                                <span className='d-inline-block margin-left-10'>
                                                  {capitalizeFirstWord(translate('report'))}
                                                </span>
                                                <span
                                                  // eslint-disable-next-line max-len
                                                  className='fal fa-external-link black-color d-inline-block margin-left-5' />
                                              </button>
                                              {item?.auditRoundId && segment?.auditedTime !== null &&
                                            <button
                                              onClick={()=> downloadReport(item?.auditRoundId)}
                                              className='no-border report-button margin-left-10'>
                                              <span >{capitalizeFirstWord(translate('audit_report'))}</span>
                                              <span
                                                className={`fal fa-external-link black-color 
                                                d-inline-block margin-left-5`}/>
                                            </button>}
                                              {physicalsegment?.deviations.length ?
                                                <button
                                                  className='no-border report-button margin-left-10'
                                                  onClick={()=> {
                                                    history.push(`/confirm-set/${item.companyId}/deviations`);
                                                  }}>
                                                  <span >{capitalizeFirstWord(translate('deviations'))}</span>
                                                  <span
                                                    className={`fal fa-external-link black-color 
                                                d-inline-block margin-left-5`}/>
                                                </button>
                                                : null
                                              }
                                            </li>
                                          </ul>
                                        </div>
                                        : ''
                                    }

                                  </div>
                                );
                              }))


                        : <div key={Math.random()}>{capitalizeFirstWord(translate('no_segments_available'))}
                        </div>
                      :
                      <div key={Math.random()}>{capitalizeFirstWord(translate('no_segments_available'))}
                      </div>
                  }
                </div>
              );


            })
            : ''
          }

        </div>
      </div>

      <div className="sepatator" />

      <div className='row container m-auto padding-0 margin-top-15-important '>
        <div className=" col-md-10 col-sm-10 padding-0 tablet-full-width">
          <h3>{capitalizeFirstWord(translate('confirmations_of_safety_procedures'))}</h3>
        </div>
        <div className=" col-md-2 col-sm-10 tablet-full-width">
          <Button
            onClick={handelClick}
            value={capitalizeFirstWord(translate('new'))}
            iconsBoolean
            icons={'fas fa-plus font-size-x-large'}
            classes={' border-radius-0 btn btn-success add-btn-label-align'}
            btnContClass={'btnContainer '}
          />
        </div>
      </div>

      <div className=" container m-auto margin-top-30-important  margin-bottom-20-important row padding-0">
        {confirmSets
          ? confirmSets?.map((item, index) => {
            return (
              <div
                key={index}
                className='width-100 segement-card-container cursor-pointer'
                onClick={()=>{ history.push(`/confirm-set/${item.id}`);}}>
                <Card className="margin-top-30-important">
                  <Card.Header>
                    <Moment className='mr-2 card-time' format="DD.MM.YYYY">{item.startTime}</Moment>
                    <span className='card-status'>
                      {
                        item.status === 'COMPANY_FILLING' ?
                          translate('COMPANY_FILLING')
                          : item.status === 'CONFIRMING' ?
                            translate('CONFIRMING')
                            :
                            translate('COMPLETED')
                      }

                    </span>

                  </Card.Header>
                  <Card.Body>
                    <div>
                      {' '}
                      {item?.segments
                        ? item.segments.map((element, index) => {
                          return (
                            <div key={index}>
                              <div className='card-body-title'>{capitalizeFirstWord(element.name)}</div>
                              <div className='card-body-details'><span>{(element?.type !== 'NORMAL') &&
                                <span>{capitalizeFirstWord(translate('physical_safety'))}:</span>
                              }
                              </span>
                              <span> {element.street ? <span>
                                <span>{` ${element.street}`}</span>
                                <span>{element.addressAlias ? ` ${element.addressAlias}` : ''}</span>
                                <span>{` ${element.postalCode}`}</span>
                                <span>{` ${element.city}`}</span>
                                {/* <span>{element.room ? `, ${element.room}` : ''}</span> */}
                              </span> : ''}</span>

                              </div>
                              <div className="sepatator" />
                            </div>
                          );
                        })
                        : ''}
                    </div>
                  </Card.Body>
                  <Card.Footer className="text-muted">
                    {item?.contacts
                      ? item.contacts.map((element2, index) => {
                        return (
                          <div key={index}>
                            <span className='card-footer-label'>{capitalizeFirstWord(translate('contact_person'))}:</span>
                            <span>{capitalizeFirstWord(element2.name)}</span>
                            <span>,{capitalizeFirstWord(element2.phone)}</span>
                            <span>,{capitalizeFirstWord(element2.email)}</span>
                          </div>
                        );
                      })
                      : ''}
                  </Card.Footer>
                </Card>


              </div>
            );
          })
          : null}
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  company: state?.companies?.company,
  confirmSets: state?.confirmSets?.confirmSets,
  segments: state?.segments?.segments,
  roundReportService,
  hasRole: authorizationService.hasRole,

});

const mapDispatchToProps = (dispatch) => {
  return {
    getCompany: (id) => dispatch(getCompany(id)),
    getConfirmSetsById: (id) => dispatch(getConfirmSetsById(id)),
    getSegments: ()=> dispatch(getSegments()),
    getConfirmSet: ()=> dispatch(getConfirmSet()),
  };
};
export const ComapnyView = connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(companyView));
