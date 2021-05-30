import React from 'react';
import { capitalizeFirstWord } from '../../helpers';
import { withTranslation } from 'react-i18next';
import { Header } from '../../components';
import { CreateConfirmSet } from '../Company/create/CreateConfirmSet';
import { useHistory } from 'react-router-dom';
function confirmSetCreate({ t: translate, match }) {
  let history = useHistory();
  const company = match.params.id;
  const cancelRedirect = () => {
    if (window.location.href.indexOf('view') > -1) {
      history.push(`/company/${company}`);
    } else {
      history.push(`/Company/${company}/update`);

    }

  };

  return (
    <div>
      <Header
        title={capitalizeFirstWord(translate('start_new_company_approval'))}
        cancel={translate('cancel')}
        cancelBoolean
        iconsBoolean={false}
        icons={''}
        classes={''}
        cancelLinkFunction={cancelRedirect}
      />
      <div className="container m-auto wrapper p-3  margin-top-30-important  margin-bottom-20-important">
        <CreateConfirmSet company={company} />
      </div>
    </div>
  );
}
export const ConfirmSetCreate = (withTranslation()(confirmSetCreate));