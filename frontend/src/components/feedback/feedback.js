import React from 'react';
import './feedback.scss';
import { withTranslation } from 'react-i18next';
import { formatDate } from '../../helpers';
function feedback({
  title,
  historylist,
  t: translate,
}

) {
  return (
    <div >
      <span > {title}
      </span>

      {historylist?.map((item, index) => {
        return (
          <div key={index}>
            {
              item.howItWasFixed &&

            <div
              className="box row"
            >
              <div className='col-6 col-md-4 '>
                <p>
                  <span>

                    {translate ('Service_provider')}
                  </span>
                  <span>
                    {item.serviceProviderEmail}

                  </span>

                </p>
                <p>
                  {item.howItWasFixed}
                </p>
              </div>
              <div className="col-md-8 date">
                {formatDate('dd.mm.yyyy', item.serviceProviderCommentDate)}
              </div>
            </div>
            }
            {
              item.comment &&

            <div
              className="box row"
            >
              <div className='col-6 col-md-4 '>
                <p>
                  <span>
                    {translate ('Security')}


                  </span>
                  <span>
                    {item.adminEmail}

                  </span>

                </p>
                <p>
                  {item.comment}
                </p>
              </div>
              <div className="col-md-8 date">
                {formatDate('dd.mm.yyyy', item.adminCommentDate)}
              </div>
            </div>
            }
          </div>

        );})
      }

    </div>
  );
}
export const Feedback = (withTranslation()(feedback));