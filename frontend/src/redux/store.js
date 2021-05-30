import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './rootReducer';
// import { composeWithDevTools } from 'redux-devtools-extension';
// import storage from 'redux-persist/lib/storage';
// eslint-disable-next-line no-unused-vars
import { persistStore, persistReducer } from 'redux-persist';
// const persistConfig = {
//     key: 'company-approve',
//     storage,
//   };

//   const persistedReducer = persistReducer(persistConfig, rootReducer);

//   let store = createStore(
//     persistedReducer,
//     composeWithDevTools(applyMiddleware(promiseMiddleware, thunk)),
//   );

const initialState = { ...rootReducer };
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(rootReducer, initialState, composeEnhancers(applyMiddleware(thunk)));
export let persistor = persistStore(store);