import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
// import { createBrowserHistory } from 'history';
import { store } from './redux';
// import bootstrap
import 'bootstrap/scss/bootstrap.scss';
import './styles/style.scss';

// eslint-disable-next-line no-unused-vars
import { PersistGate } from 'redux-persist/integration/react';
// eslint-disable-next-line no-unused-vars
import { persistStore, persistReducer } from 'redux-persist';
import { RootContainer } from './containers';

import i18n from './i18n';
import { cookiesHandler } from './helpers';

// eslint-disable-next-line no-unused-vars
const App = ({ t: translate }) => {
  // eslint-disable-next-line no-unused-vars
  let persistor = persistStore(store);

  useEffect(() => {
    setuplang();
  }, []);
  const setuplang = () => {
    i18n.changeLanguage(cookiesHandler.get('lang') || i18n.language);
    if (i18n.language !== 'en') {
      i18n.changeLanguage('fi');
      localStorage.setItem('lang', 'fi');
    }
  };

  // var hist = createBrowserHistory();
  return (
    <div>

      <Provider store={store}>

        <RootContainer />

      </Provider>
    </div>
  );
};

export default App;
