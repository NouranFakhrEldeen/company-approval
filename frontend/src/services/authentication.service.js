/* eslint-disable no-undef */
import {
  BaseService,
} from './';

import extractQueryParam from './../helpers/extract-query-param-helper';

export const AuthenticationServiceFactory = (function () {
  let instance;

  function createInstance() {
    return new AuthenticationService();
  }
  return {
    getInstance() {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    },
  };
})();

class AuthenticationService extends BaseService {
  getToken = () => {
    const queryParamToken = extractQueryParam('jwtToken');
    if (queryParamToken) {
      // TODO: add expiration check or some kind of notification
      // informing user about the expired token.
      sessionStorage.setItem('jwtToken', queryParamToken);
      return queryParamToken;
    }
    const tokenOrObject = JSON.parse(sessionStorage.getItem('jwtToken') || null);
    if (tokenOrObject) {
      if (
        typeof tokenOrObject === 'object' &&
        Object.prototype.hasOwnProperty.call(tokenOrObject, 'value')
      ) {
        return tokenOrObject.value;
      }
      return tokenOrObject;
    } else {
      return localStorage.getItem('token');
    }
  };
  setToken = (token) => {
    return sessionStorage.setItem('token', token);
  };
  getScopes = () => {
    return JSON.parse(localStorage.getItem('scopes') || null) || JSON.parse(sessionStorage.getItem('scopes') || null);
  };
  setScopes = (scopes) => {
    if (!Array.isArray(scopes)) {
      return false;
    }
    return sessionStorage.setItem('scopes', JSON.stringify(scopes));
  };
  getUserData = () => {
    return JSON.parse(sessionStorage.getItem('user') || '{}');
  };
  setUserData = (firstName, lastName) => {
    return sessionStorage.setItem('user', JSON.stringify({ firstName, lastName }));
  };
  checkUserScope = (userScope) => {
    try {
      const scopes = JSON.parse(localStorage.getItem('scopes') || null) ||
        JSON.parse(sessionStorage.getItem('scopes') || null);
      return scopes && scopes.length && scopes.some((scope) => {
        return scope === '*:*' ||
          scope === `${userScope.split(':')[0]}:*` ||
          userScope === scope;
      });
    } catch (e) {
      sessionStorage.setItem('scopes', null);
    }
  };
  redirectionToLogin = async () => {
    // eslint-disable-next-line no-undef
    if (!process.env.REACT_APP_LOGIN_URL) {
      return window.location.replace(`/idp/signin?redirectLink=${encodeURIComponent(window.location.href)}`);
    }
    // eslint-disable-next-line no-undef
    window.location.replace(process.env.REACT_APP_LOGIN_URL);
  };
  logout = async () => {
    localStorage.setItem('user', null);
    localStorage.setItem('token', null);
    localStorage.setItem('scopes', null);
    sessionStorage.setItem('role', null);
    // eslint-disable-next-line no-undef
    if (!process.env.REACT_APP_LOGOUT_URL) {
      return window.location.replace('/idp/signout');
    }
    // eslint-disable-next-line no-undef
    window.location.replace(process.env.REACT_APP_LOGOUT_URL);
  };
  getUserRole = () => {
    return localStorage.getItem('role') || sessionStorage.getItem('role');
  };
  hasRole = (roles) => {
    try {
      const userRole = localStorage.getItem('role') || sessionStorage.getItem('role');
      // eslint-disable-next-line no-console
      return roles && roles.length && userRole && roles.includes(userRole);
    } catch (e) {
      sessionStorage.setItem('role', null);
    }
  };
}
