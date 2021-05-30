import { AuthenticationServiceFactory, BaseService } from '.';
import Axios from 'axios';
import { errors } from '../helpers/error-handling.helper';

export const ConfirmSetServiceFactory = (function () {
  let instance;
  function createInstance() {
    return new ConfirmSetService();
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
class ConfirmSetService extends BaseService {
  serviceRoute;
  authenticationService = AuthenticationServiceFactory.getInstance();
  constructor() {
    super();
    this.serviceRoute = 'confirm-set';
    this.configuration = {
      headers: {
        Authorization: `Bearer ${this.authenticationService.getToken()}`,
      },
    };
  }

  async answer(id, body, withError) {
    return await Axios.patch(`${this.generateURL(id)}/answer`, body, {
      ...this.configuration,
    })
      .catch(error => {
        if (!withError) {
          errors(error);
        } else {
          throw error;
        }
      });
  }

  async review(id, body, withError) {
    return await Axios.patch(`${this.generateURL(id)}/review`, body, {
      ...this.configuration,
    })
      .catch(error => {
        if (!withError) {
          errors(error);
        } else {
          throw error;
        }
      });
  }
}
